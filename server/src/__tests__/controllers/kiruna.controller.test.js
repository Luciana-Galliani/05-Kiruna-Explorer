import { getBoundaries } from "../../controllers/kiruna.controller.mjs";

describe("getBoundaries", () => {
    let req, res;
    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            sendFile: jest.fn(),
        };
    });

    it("should send the geojson file", async () => {
        await getBoundaries(req, res);
        expect(res.sendFile).toHaveBeenCalledTimes(1);
    });

    it("should handle errors", async () => {
        res.sendFile.mockImplementation(() => {
            throw new Error("File error");
        });

        await getBoundaries(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});
