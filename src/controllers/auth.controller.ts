import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma/prismaClient";
import { ValidationError } from "../utils/errors";
import { createUserSchema, loginUserSchema } from "../validators/authValidator";
import { generateToken } from "../utils/authUtils";

// Signup Controller
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Validate the incoming request data
    const { error } = createUserSchema.validate(req.body);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "USER", // default role is USER
      },
    });

    // Generate JWT token
    const token = generateToken(newUser);

    res.status(201).json({
      message: "User created successfully",
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.createdAt,
        },
        auth: {
          token,
          type: "Bearer",
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Login Controller
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate the incoming request data
    const { error } = loginUserSchema.validate(req.body);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          status: user.status,
          createdAt: user.createdAt,
        },
        auth: {
          token,
          type: "Bearer",
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
    return;
  }
};
