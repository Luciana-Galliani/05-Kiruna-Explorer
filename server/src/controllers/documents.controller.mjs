import documentDao from "../dao/document.dao.mjs";

export const getDocuments = async (req, res) => {
    const documents = await documentDao.getDocuments();
    res.status(200).json(documents);
};

export const createDocument = (req, res) => {
    res.send("Create document");
};
