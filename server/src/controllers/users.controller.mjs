import UserDAO from "../dao/user.dao.mjs";

const userDAO = new UserDAO();

export const getUser = async (req, res) => {
    const username = req.username;
    const user = await userDAO.getUserByUsername(username);
    return user;
};

export const createUser = async (req, res) => {
    const username = req.username;
    const password = req.password;
    const user = await userDAO.createUser(username, password);
    console.log(user);
    return user;
};
