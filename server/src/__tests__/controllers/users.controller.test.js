import {
    registerUser,
    loginUser,
} from "../../controllers/users.controller.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import usersDAO from "../../dao/users.dao.mjs";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../dao/users.dao.mjs", () => ({
    createUser: jest.fn(),
    getUserByUsername: jest.fn(),
}));

describe("User Controller", () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("registerUser", () => {
        it("should return 400 if username or password is missing", async () => {
            req.body = { username: "", password: "" };

            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "Username and password required",
            });
        });

        it("should return 201 and the username if registration is successful", async () => {
            req.body = { username: "testUser", password: "password123" };
            const hashedPassword = "hashedPassword123";

            bcrypt.hash.mockResolvedValue(hashedPassword);
            usersDAO.createUser.mockResolvedValue({ username: "testUser" });

            await registerUser(req, res);

            expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
            expect(usersDAO.createUser).toHaveBeenCalledWith(
                "testUser",
                hashedPassword
            );
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: "User created",
                user: "testUser",
            });
        });

        it("should return 500 if an error occurs during registration", async () => {
            req.body = { username: "testUser", password: "password123" };
            const error = new Error("Database error");
            bcrypt.hash.mockRejectedValue(error);

            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe("loginUser", () => {
        it("should return 404 if the user is not found", async () => {
            req.body = { username: "unknownUser", password: "password123" };
            usersDAO.getUserByUsername.mockResolvedValue(null);

            await loginUser(req, res);

            expect(usersDAO.getUserByUsername).toHaveBeenCalledWith(
                "unknownUser"
            );
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
        });

        it("should return 401 if the password is invalid", async () => {
            req.body = { username: "testUser", password: "wrongPassword" };
            usersDAO.getUserByUsername.mockResolvedValue({
                username: "testUser",
                password: "hashedPassword",
            });
            bcrypt.compare.mockResolvedValue(false);

            await loginUser(req, res);

            expect(bcrypt.compare).toHaveBeenCalledWith(
                "wrongPassword",
                "hashedPassword"
            );
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: "Invalid password",
            });
        });

        it("should return 200 and a token if login is successful", async () => {
            req.body = { username: "testUser", password: "password123" };
            const mockUser = {
                id: 1,
                username: "testUser",
                password: "hashedPassword",
            };
            const mockToken = "mockToken123";

            usersDAO.getUserByUsername.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue(mockToken);

            await loginUser(req, res);

            expect(bcrypt.compare).toHaveBeenCalledWith(
                "password123",
                "hashedPassword"
            );
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: mockUser.id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Login successful",
                token: mockToken,
            });
        });

        it("should return 500 if an error occurs during login", async () => {
            req.body = { username: "testUser", password: "password123" };
            const error = new Error("Database error");
            usersDAO.getUserByUsername.mockRejectedValue(error);

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });
});
