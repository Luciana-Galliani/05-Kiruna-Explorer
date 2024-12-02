import { centroid } from "@turf/turf";

export function calculateCentroid(geojson) {
    try {
        if (!geojson || !["Polygon", "MultiPolygon"].includes(geojson.type)) {
            throw new Error("The GeoJSON must be of type Polygon or MultiPolygon.");
        }

        const center = centroid(geojson);

        const [centerLon, centerLat] = center.geometry.coordinates;

        return { centerLat, centerLon };
    } catch (error) {
        console.error("Error while computing the centroid of the GeoJSON :", error.message);
        return null;
    }
}
