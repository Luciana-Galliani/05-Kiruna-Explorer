const getAuthToken = () => localStorage.getItem("authToken");

const baseURL = "http://localhost:3001";

const authHeaders = () => ({
    Authorization: `Bearer ${getAuthToken()}`,
});

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

const registerUser = async ({ username, password }) => {
    const response = await fetch(`${baseURL}/api/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
        const doc = await response.json();
        return doc;
    } else {
        const errDetails = await response.json();
        throw new Error(errDetails.error);
    }
};

const loginUser = async ({ username, password }) => {
    const response = await fetch(`${baseURL}/api/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
        const doc = await response.json();
        localStorage.setItem("authToken", doc.token);
        return doc;
    } else {
        const errDetails = await response.text();
        throw errDetails;
    }
};

const getDocuments = async () => {
    const response = await fetch(`${baseURL}/api/documents`, {
        headers: authHeaders(),
    });
    if (response.ok) {
        const documents = await response.json();
        return documents;
    } else {
        const errDetails = await response.text();
        throw errDetails;
    }
};

const getDocument = async (documentId) => {
    const response = await fetch(`${baseURL}/api/documents/${documentId}`, {
        method: "GET",
        headers: authHeaders(),
    });
    if (response.ok) {
        const doc = await response.json();
        return doc;
    } else {
        const errDetails = await response.text();
        throw errDetails;
    }
};

const createDocument = async (documentData, files) => {
    const formData = new FormData();
    formData.append(
        "documentData",
        JSON.stringify({
            ...documentData,
            connections: documentData.connections.map((connection) => ({
                documentId: connection.targetDocument.id,
                relationship: connection.relationship,
            })),
        })
    );

    if (files && files.length > 0) {
        for (const file of files) {
            formData.append("files", file);
        }
    }
    const response = await fetch(`${baseURL}/api/documents`, {
        method: "POST",
        headers: authHeaders(false),
        body: formData,
    });

    if (response.ok) {
        const doc = await response.json();
        return doc;
    } else {
        const errDetails = await response.text();
        throw errDetails;
    }
};

const updateDocument = async (documentId, documentData, selectedFiles) => {
    const formData = new FormData();

    formData.append(
        "documentData",
        JSON.stringify({
            ...documentData,
            connections: documentData.connections.map((connection) => ({
                documentId: connection.targetDocument.id,
                relationship: connection.relationship,
            })),
        })
    );

    if (selectedFiles && selectedFiles.length > 0) {
        for (const file of selectedFiles) {
            formData.append("files", file);
        }
    }

    const response = await fetch(`${baseURL}/api/documents/${documentId}`, {
        method: "PUT",
        headers: authHeaders(false),
        body: formData,
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
    const response = await fetch(`${baseURL}/api/connections`, {
        headers: authHeaders(),
    });
    if (response.ok) {
        const connections = await response.json();
        return connections;
    } else {
        const errDetails = await response.text();
        throw errDetails;
    }
};

const getStakeholders = async () => {
    const response = await fetch(`${baseURL}/api/stakeholders`, {
        headers: authHeaders(),
    });
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
    registerUser,
    loginUser,
    getDocuments,
    getDocument,
    createDocument,
    updateDocument,
    getConnections,
    getStakeholders,
};

export default API;
