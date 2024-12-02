import sequelize from "../sequelize.mjs";

class AreasDAO {
    async getAreas() {
        try {
            const areas = await sequelize.models.Area.findAll();
            return areas;
        } catch (error) {
            throw error;
        }
    }

    async createArea(areaData) {
        try {
            const area = await sequelize.models.Area.create({
                name: areaData.name,
                geojson: areaData.geojson,
                centerLat: areaData.centerLat,
                centerLon: areaData.centerLon,
            });

            return area;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default new AreasDAO();
