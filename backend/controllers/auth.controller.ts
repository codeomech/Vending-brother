import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

// Define the payload structure for JWT
interface JwtPayload {
  user: {
    id: string;
    isAdmin: boolean;
  };
}

// Login Admin
export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const payload: JwtPayload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).send("Server error");
  }
};

// Register Admin
export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    user = new User({
      username,
      password,
      isAdmin: true,
    });

    await user.save();

    const payload: JwtPayload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).send("Server error");
  }
};
