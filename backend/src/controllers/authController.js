import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const registerUser = async (req, res) => {
  try {
    const { email, password, name, age, gender, bio, photoUrl} = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    // Check if user is underage
    if (parseInt(age) < 18) {
      return res.status(400).json({ message: "You must be at least 18 years old to register." });
    }

    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user + profile in one transaction
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: {
            name,
            age: parseInt(age),
            bio,
            gender,
            photoUrl,
          },
        },
      },
      include: {
        profile: true, // return profile info too
      },
    });

    // Return success
    res.status(201).json({
      message: "User and profile created successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    //Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    //Find the user and include profile
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    //Verify password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // Remove password before sending user data
    const { password: _, ...userWithoutPassword } = user;

    // Respond with token and safe user data
    res.status(200).json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};
