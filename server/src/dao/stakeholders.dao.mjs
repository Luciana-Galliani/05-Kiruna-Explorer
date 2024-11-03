import sequelize from "../sequelize.mjs";

class StakeholdersDAO {
    async getStakeholders() {
        try {
            const stakeholders = await sequelize.models.Stakeholder.findAll();
            return stakeholders;
        } catch (error) {
            throw error;
        }
    }
}

export default new StakeholdersDAO();
