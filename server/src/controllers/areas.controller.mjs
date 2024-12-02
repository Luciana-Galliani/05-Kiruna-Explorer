import areasDAO from "../dao/areas.dao.mjs";
import { calculateCentroid } from "../utils/areasGeometry.mjs";

export const getAreas = async (req, res) => {
    try {
        const areas = await areasDAO.getAreas();
        res.status(200).json({ areas });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createArea = async (req, res) => {
    try {
        const area = req.body;
        ({ centerLat: area.centerLat, centerLon: area.centerLon } = calculateCentroid(
            area.geojson
        ));
        const createdArea = await areasDAO.createArea(area);
        res.status(201).json({ area: createdArea });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
