import stakeholdersDAO from "../../dao/stakeholders.dao.mjs";
import sequelize from "../../sequelize.mjs";

jest.mock("../../sequelize.mjs", () => ({
    models: {
        Stakeholder: {
            findAll: jest.fn(),
        },
    },
}));

describe("StakeholdersDAO", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getStakeholders", () => {
        it("should return stakeholders when findAll is successful", async () => {
            const mockStakeholders = [
                { id: 1, name: "Municipality", color: "#000000" },
                { id: 2, name: "Architecture Firms", color: "#000001" },
            ];
            sequelize.models.Stakeholder.findAll.mockResolvedValue(
                mockStakeholders
            );

            const result = await stakeholdersDAO.getStakeholders();

            expect(result).toEqual(mockStakeholders);
            expect(sequelize.models.Stakeholder.findAll).toHaveBeenCalledTimes(
                1
            );
        });

        it("should throw an error when findAll fails", async () => {
            const mockError = new Error("Database error");
            sequelize.models.Stakeholder.findAll.mockRejectedValue(mockError);

            await expect(stakeholdersDAO.getStakeholders()).rejects.toThrow(
                mockError
            );
            expect(sequelize.models.Stakeholder.findAll).toHaveBeenCalledTimes(
                1
            );
        });
    });
});
