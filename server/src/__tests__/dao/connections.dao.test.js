import connectionsDAO from "../../dao/connections.dao.mjs";

jest.mock("../../sequelize.mjs", () => ({
    models: {
        Connection: {
            getAttributes: jest.fn().mockReturnValue({
                relationship: {
                    values: ["Update", "Prevision"],
                },
            }),
        },
    },
}));

describe("ConnectionsDAO", () => {
    test("should return connection relationships", () => {
        const connections = connectionsDAO.getConnections();
        expect(connections).toEqual(["Update", "Prevision"]);
    });
});
