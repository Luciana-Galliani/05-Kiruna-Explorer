import { getAreas, createArea } from "../../controllers/areas.controller.mjs";
import areasDAO from "../../dao/areas.dao.mjs";
import { calculateCentroid } from "../../utils/areasGeometry.mjs";

jest.mock("../../dao/areas.dao.mjs", () => ({
    getAreas: jest.fn(),
    createArea: jest.fn(),
}));
jest.mock("../../utils/areasGeometry.mjs", () => ({
    calculateCentroid: jest.fn(),
}));

describe("Areas Controller", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAreas", () => {
        it("should return areas with status 200 when areasDAO.getAreas resolves", async () => {
            const mockAreas = [
                { id: 1, name: "Area 1", geojson: {}, centerLat: 1.1, centerLon: 1.2 },
            ];
            areasDAO.getAreas.mockResolvedValue(mockAreas);

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getAreas(req, res);

            expect(areasDAO.getAreas).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ areas: mockAreas });
        });

        it("should return an error with status 500 when areasDAO.getAreas rejects", async () => {
            const mockError = new Error("Database error");
            areasDAO.getAreas.mockRejectedValue(mockError);

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getAreas(req, res);

            expect(areasDAO.getAreas).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
        });
    });

    describe("createArea", () => {
        it("should create an area and return it with status 201 when all operations succeed", async () => {
            const req = {
                body: {
                    name: "New Area",
                    geojson: {},
                },
            };

            const mockCentroid = { centerLat: 10.1, centerLon: 20.2 };
            const mockCreatedArea = { id: 1, ...req.body, ...mockCentroid };

            calculateCentroid.mockReturnValue(mockCentroid);
            areasDAO.createArea.mockResolvedValue(mockCreatedArea);

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await createArea(req, res);

            expect(calculateCentroid).toHaveBeenCalledWith(req.body.geojson);
            expect(areasDAO.createArea).toHaveBeenCalledWith({
                ...req.body,
                ...mockCentroid,
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ area: mockCreatedArea });
        });

        it("should return an error with status 500 if calculateCentroid throws an error", async () => {
            const req = {
                body: {
                    name: "New Area",
                    geojson: {},
                },
            };

            const mockError = new Error("Centroid calculation error");
            calculateCentroid.mockImplementation(() => {
                throw mockError;
            });

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await createArea(req, res);

            expect(calculateCentroid).toHaveBeenCalledWith(req.body.geojson);
            expect(areasDAO.createArea).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
        });

        it("should return an error with status 500 if areasDAO.createArea throws an error", async () => {
            const req = {
                body: {
                    name: "New Area",
                    geojson: {},
                },
            };

            const mockCentroid = { centerLat: 10.1, centerLon: 20.2 };
            const mockError = new Error("Database error");

            calculateCentroid.mockReturnValue(mockCentroid);
            areasDAO.createArea.mockRejectedValue(mockError);

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await createArea(req, res);

            expect(calculateCentroid).toHaveBeenCalledWith(req.body.geojson);
            expect(areasDAO.createArea).toHaveBeenCalledWith({
                ...req.body,
                ...mockCentroid,
            });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
        });
    });
});
