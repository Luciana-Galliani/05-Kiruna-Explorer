import usersDAO from "../../dao/users.dao.mjs";
import sequelize from "../../sequelize.mjs";

jest.mock("../../sequelize.mjs", () => ({
    models: {
        User: {
            findOne: jest.fn(),
            create: jest.fn(),
        },
    },
}));

describe("UsersDAO", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createUser", () => {
        it("should create a new user and return the user data", async () => {
            const mockUser = {
                id: 1,
                username: "testUser",
                password: "hashedPassword",
            };
            sequelize.models.User.create.mockResolvedValue(mockUser);

            const result = await usersDAO.createUser(
                "testUser",
                "hashedPassword"
            );

            expect(sequelize.models.User.create).toHaveBeenCalledWith({
                username: "testUser",
                password: "hashedPassword",
            });
            expect(result).toEqual(mockUser);
        });

        it("should throw an error if user creation fails", async () => {
            const errorMessage = "Failed to create user";
            sequelize.models.User.create.mockRejectedValue(
                new Error(errorMessage)
            );

            await expect(
                usersDAO.createUser("testUser", "hashedPassword")
            ).rejects.toThrow(errorMessage);
            expect(sequelize.models.User.create).toHaveBeenCalledWith({
                username: "testUser",
                password: "hashedPassword",
            });
        });
    });

    describe("getUserByUsername", () => {
        it("should return a user if username exists", async () => {
            const mockUser = {
                id: 1,
                username: "testUser",
                password: "hashedPassword",
            };
            sequelize.models.User.findOne.mockResolvedValue(mockUser);

            const result = await usersDAO.getUserByUsername("testUser");

            expect(sequelize.models.User.findOne).toHaveBeenCalledWith({
                where: { username: "testUser" },
            });
            expect(result).toEqual(mockUser);
        });

        it("should return null if no user is found with the given username", async () => {
            sequelize.models.User.findOne.mockResolvedValue(null);

            const result = await usersDAO.getUserByUsername("nonexistentUser");

            expect(sequelize.models.User.findOne).toHaveBeenCalledWith({
                where: { username: "nonexistentUser" },
            });
            expect(result).toBeNull();
        });

        it("should throw an error if findOne fails", async () => {
            const errorMessage = "Error finding user";
            sequelize.models.User.findOne.mockRejectedValue(
                new Error(errorMessage)
            );

            await expect(
                usersDAO.getUserByUsername("testUser")
            ).rejects.toThrow(errorMessage);
            expect(sequelize.models.User.findOne).toHaveBeenCalledWith({
                where: { username: "testUser" },
            });
        });
    });
});
