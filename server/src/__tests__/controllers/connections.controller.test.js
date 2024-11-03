import { getConnections } from "../../controllers/connections.controller.mjs";
import connectionsDao from "../../dao/connections.dao.mjs";

jest.mock("../../dao/connections.dao.mjs", () => ({
    getConnections: jest.fn(),
}));

describe("getConnections", () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should respond with a 200 status and connections data", async () => {
        // Mock data returned by connectionsDao.getConnections
        const mockConnections = ["Update", "Prevision"];
        connectionsDao.getConnections.mockReturnValue(mockConnections);

        await getConnections(req, res);

        expect(connectionsDao.getConnections).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ connections: mockConnections });
    });
});
