import connectionsDao from "../dao/connections.dao.mjs";

export const getConnections = async (req, res) => {
    const connections = connectionsDao.getConnections();
    res.status(200).json({ connections: connections });
};
