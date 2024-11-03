import { getStakeholders } from "../../controllers/stakeholders.controller.mjs";
import stakeholdersDao from "../../dao/stakeholders.dao.mjs";

jest.mock("../../dao/stakeholders.dao.mjs", () => ({
    getStakeholders: jest.fn(),
}));

describe("getStakeholders", () => {
    let req, res;

    beforeEach(() => {
        req = {}; // Mock request object
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should respond with a 200 status and stakeholders data", async () => {
        // Mock data returned by stakeholdersDao.getStakeholders
        const mockStakeholders = [
            { id: 1, name: "Stakeholder 1" },
            { id: 2, name: "Stakeholder 2" },
        ];
        stakeholdersDao.getStakeholders.mockResolvedValue(mockStakeholders);

        await getStakeholders(req, res);

        expect(stakeholdersDao.getStakeholders).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            stakeholders: mockStakeholders,
        });
    });

    it("should respond with a 500 status and error message if an error is thrown", async () => {
        const error = new Error("Database error");
        stakeholdersDao.getStakeholders.mockRejectedValue(error);

        await getStakeholders(req, res);

        expect(stakeholdersDao.getStakeholders).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
});
