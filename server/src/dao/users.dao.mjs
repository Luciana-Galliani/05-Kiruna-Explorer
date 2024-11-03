import sequelize from "../sequelize.mjs";

class UsersDAO {
    async createUser(username, hashedPassword) {
        try {
            const newUser = await sequelize.models.User.create({
                username: username,
                password: hashedPassword,
            });
            return newUser;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getUserByUsername(username) {
        try {
            const user = await sequelize.models.User.findOne({
                where: { username },
            });
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default new UsersDAO();
