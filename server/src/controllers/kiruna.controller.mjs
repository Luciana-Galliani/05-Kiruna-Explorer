export const getBoundaries = async (req, res) => {
    try {
        res.sendFile("kirunaMunicipality.geojson", { root: "resources" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
