import { calculateCentroid } from "../../utils/areasGeometry.mjs";
import { centroid } from "@turf/turf";

jest.mock("@turf/turf", () => ({
    centroid: jest.fn(),
}));

describe("calculateCentroid", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should calculate the centroid for a valid Polygon GeoJSON", () => {
        const geojson = {
            type: "Polygon",
            coordinates: [
                [
                    [0, 0],
                    [10, 0],
                    [10, 10],
                    [0, 10],
                    [0, 0],
                ],
            ],
        };

        const mockedCentroid = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [5, 5],
            },
        };

        centroid.mockReturnValue(mockedCentroid);

        const result = calculateCentroid(geojson);

        expect(result).toEqual({ centerLat: 5, centerLon: 5 });
        expect(centroid).toHaveBeenCalledWith(geojson);
    });

    it("should calculate the centroid for a valid MultiPolygon GeoJSON", () => {
        const geojson = {
            type: "MultiPolygon",
            coordinates: [
                [
                    [
                        [0, 0],
                        [10, 0],
                        [10, 10],
                        [0, 10],
                        [0, 0],
                    ],
                ],
            ],
        };

        const mockedCentroid = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [5, 5],
            },
        };

        centroid.mockReturnValue(mockedCentroid);

        const result = calculateCentroid(geojson);

        expect(result).toEqual({ centerLat: 5, centerLon: 5 });
        expect(centroid).toHaveBeenCalledWith(geojson);
    });

    it("should return null and log an error for invalid GeoJSON type", () => {
        const geojson = {
            type: "Point",
            coordinates: [5, 5],
        };

        console.error = jest.fn();

        const result = calculateCentroid(geojson);

        expect(result).toBeNull();
        expect(console.error).toHaveBeenCalledWith(
            "Error while computing the centroid of the GeoJSON :",
            "The GeoJSON must be of type Polygon or MultiPolygon."
        );
        expect(centroid).not.toHaveBeenCalled();
    });

    it("should return null and log an error for null or undefined GeoJSON", () => {
        console.error = jest.fn();

        const result = calculateCentroid(null);

        expect(result).toBeNull();
        expect(console.error).toHaveBeenCalledWith(
            "Error while computing the centroid of the GeoJSON :",
            "The GeoJSON must be of type Polygon or MultiPolygon."
        );
        expect(centroid).not.toHaveBeenCalled();
    });

    it("should handle errors thrown by @turf/turf", () => {
        const geojson = {
            type: "Polygon",
            coordinates: [
                [
                    [0, 0],
                    [10, 0],
                    [10, 10],
                    [0, 10],
                    [0, 0],
                ],
            ],
        };

        centroid.mockImplementation(() => {
            throw new Error("Some internal error");
        });

        console.error = jest.fn();

        const result = calculateCentroid(geojson);

        expect(result).toBeNull();
        expect(console.error).toHaveBeenCalledWith(
            "Error while computing the centroid of the GeoJSON :",
            "Some internal error"
        );
    });
});
