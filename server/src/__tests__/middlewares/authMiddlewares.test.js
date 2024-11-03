import authMiddleware from "../../middlewares/authMiddlewares.mjs";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

describe("authMiddleware", () => {
    let req, res, next;

    beforeEach(() => {
        req = { headers: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 403 if no token is provided", () => {
        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: "No token provided" });
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 if the token is invalid", () => {
        req.headers["authorization"] = "invalidToken";
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Error("Invalid token"), null);
        });

        authMiddleware(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith(
            "invalidToken",
            process.env.JWT_SECRET,
            expect.any(Function)
        );
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
        expect(next).not.toHaveBeenCalled();
    });

    it("should call next and set req.userId if the token is valid", () => {
        const decoded = { id: 1 };
        req.headers["authorization"] = "validToken";
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, decoded);
        });

        authMiddleware(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith(
            "validToken",
            process.env.JWT_SECRET,
            expect.any(Function)
        );
        expect(req.userId).toBe(decoded.id);
        expect(next).toHaveBeenCalled();
    });
});
