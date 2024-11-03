import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//import { User } from '../sequelize/models/user.model.mjs';
import { getUser, createUser } from "../controllers/users.controller.mjs";

const router = express.Router();

// POST /register
router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    //return error if username or password is missing
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
    }

    try{
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user
    const user = await createUser({ username : username, password:  hashedPassword });
    
    res.status(201).json({message: "User created", user: user.username});

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// POST /login
router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await getUser({username: username});
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }
  
      // Generate token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

export default router;