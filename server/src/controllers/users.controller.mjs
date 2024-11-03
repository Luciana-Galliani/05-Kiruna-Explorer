import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import usersDAO from "../dao/users.dao.mjs";

export const registerUser = async (req, res) => {
    const { username, password } = req.body;

    //return error if username or password is missing
    if (!username || !password) {
        return res
            .status(400)
            .json({ error: "Username and password required" });
    }

    try {
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create user
        const user = await usersDAO.createUser(username, hashedPassword);

        res.status(201).json({ message: "User created", user: user.username });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await usersDAO.getUserByUsername(username);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Generate token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
