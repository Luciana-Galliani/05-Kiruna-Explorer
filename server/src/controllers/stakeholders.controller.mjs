import stakeholdersDao from "../dao/stakeholders.dao.mjs";

export const getStakeholders = async (req, res) => {
    try {
        const stakeholders = await stakeholdersDao.getStakeholders();
        res.status(200).json({ stakeholders: stakeholders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
