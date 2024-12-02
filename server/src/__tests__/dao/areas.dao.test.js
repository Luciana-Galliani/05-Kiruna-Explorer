import AreasDAO from "../../dao/areas.dao.mjs";
import sequelize from "../../sequelize.mjs";

jest.mock("../../sequelize.mjs", () => ({
    models: {
        Area: {
            findAll: jest.fn(),
            create: jest.fn(),
        },
    },
}));

describe("AreasDAO", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAreas", () => {
        it("should return a list of areas when sequelize.models.Area.findAll resolves", async () => {
            const mockAreas = [
                { id: 1, name: "Area 1", geojson: {}, centerLat: 1.1, centerLon: 1.2 },
                { id: 2, name: "Area 2", geojson: {}, centerLat: 2.1, centerLon: 2.2 },
            ];

            sequelize.models.Area.findAll.mockResolvedValue(mockAreas);

            const result = await AreasDAO.getAreas();

            expect(result).toEqual(mockAreas);
            expect(sequelize.models.Area.findAll).toHaveBeenCalledTimes(1);
        });

        it("should throw an error if sequelize.models.Area.findAll rejects", async () => {
            const mockError = new Error("Database error");

            sequelize.models.Area.findAll.mockRejectedValue(mockError);

            await expect(AreasDAO.getAreas()).rejects.toThrow("Database error");
            expect(sequelize.models.Area.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe("createArea", () => {
        it("should create a new area and return it when sequelize.models.Area.create resolves", async () => {
            const areaData = {
                name: "New Area",
                geojson: {},
                centerLat: 10.1,
                centerLon: 20.2,
            };

            const mockCreatedArea = {
                id: 1,
                ...areaData,
            };

            sequelize.models.Area.create.mockResolvedValue(mockCreatedArea);

            const result = await AreasDAO.createArea(areaData);

            expect(result).toEqual(mockCreatedArea);
            expect(sequelize.models.Area.create).toHaveBeenCalledTimes(1);
            expect(sequelize.models.Area.create).toHaveBeenCalledWith({
                name: areaData.name,
                geojson: areaData.geojson,
                centerLat: areaData.centerLat,
                centerLon: areaData.centerLon,
            });
        });

        it("should throw an error if sequelize.models.Area.create rejects", async () => {
            const areaData = {
                name: "New Area",
                geojson: {},
                centerLat: 10.1,
                centerLon: 20.2,
            };

            const mockError = new Error("Validation error");

            sequelize.models.Area.create.mockRejectedValue(mockError);

            await expect(AreasDAO.createArea(areaData)).rejects.toThrow("Validation error");
            expect(sequelize.models.Area.create).toHaveBeenCalledTimes(1);
        });
    });
});
