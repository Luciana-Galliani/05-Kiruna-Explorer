import sequelize from "../sequelize.mjs";

class UserDAO {

    async createUser(username, hashedPassword) {

        const user = await sequelize.models.User.create({username: username, password: hashedPassword});

        return {username: user.username, password: user.password};
    }

    async getUserByUsername(username) {
        const user = await sequelize.models.User.findOne({ where: { username } });

        return {username: user.username, password: user.password};
    }
}


export default UserDAO;