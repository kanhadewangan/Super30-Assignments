import express from "express";
import prisma from "./prisma/prisma";
import jwt, { type JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password,
        role: "user",
      },
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.users.findUnique({
      where: {
        email,
        password,
      },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    if (user.password !== password) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET as string,
      { expiresIn: "1h" },
    );
    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/provider/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password,
        role: "service_provider",
      },
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/provider/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.users.findUnique({
      where: {
        email,
        password,
      },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    if (user.password !== password) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET as string,
      { expiresIn: "1h" },
    );
    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


const users = router;
export default users;
