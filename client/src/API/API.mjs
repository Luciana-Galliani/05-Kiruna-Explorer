const baseURL = "http://localhost:3001";

const getUsers = async () => {
    const response = await fetch(`${baseURL}/api/users`);
    if (response.ok) {
        const users = await response.json();
        return users;
    } else {
        const errDetails = await response.text();
        throw errDetails;
    }
};

const getDocuments = async () => {
    const response = await fetch(`${baseURL}/api/documents`);
    if (response.ok) {
        const documents = await response.json();
        return documents;
    } else {
        const errDetails = await response.text();
        throw errDetails;
    }
};

//get the document for a specific documentId
const getDocument = async (documentId) => {
    const response = await fetch(`${baseURL}/api/services/${documentId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (response.ok) {
        const doc = await response.json();
        return doc;
    } else {
        const errDetails = await response.text();
        throw errDetails;
    }
};

// create document
const createDocument = async (documentData) => {
    const response = await fetch(`${baseURL}/api/documents`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentData }),
    });
    if (response.ok) {
        const doc = await response.json();
        return doc;
    } else {
        const errDetails = await response.text();
        throw errDetails;
    }
};

const updateDocument = async (documentData) => {
    const response = await fetch(`${baseURL}/api/documents/:id`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentData }),
    });
    if (response.ok) {
        const doc = await response.json();
        return doc;
    } else {
        const errDetails = await response.text();
        throw errDetails;
    }
};

const getConnections = async () => {
    const response = await fetch(`${baseURL}/api/connections`);
    if (response.ok) {
        const connections = await response.json();
        return connections;
    } else {
        const errDetails = await response.text();
        throw errDetails;
    }
};

const getStakeholders = async () => {
    const response = await fetch(`${baseURL}/api/stakeholders`);
    if (response.ok) {
        const stakeholders = await response.json();
        return stakeholders;
    } else {
        const errDetails = await response.text();
        throw errDetails;
    }
};

const API = {
    getUsers,
    getDocuments,
    getDocument,
    createDocument,
    updateDocument,
    getConnections,
    getStakeholders
}

export default API;