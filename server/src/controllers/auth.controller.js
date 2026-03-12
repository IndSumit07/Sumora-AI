import User from "../models/user.model.js";
import Blacklist from "../models/blacklist.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * @name registerUserController
 * @desc Controller to handle user registration
 * @route POST /api/auth/register
 * @access Public
 */
export async function registerUserController(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "An account with that username or email already exists",
      });
    }

    // Create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate a JWT token
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("token", token);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {}
}

/**
 * @name loginUserController
 * @desc Controller to handle user login
 * @route POST /api/auth/login
 * @access Public
 */
export async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("token", token);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @name logoutUserController
 * @desc Controller to handle user logout
 * @route GET /api/auth/logout
 * @access Public
 */
export async function logoutUserController(req, res) {
  try {
    const token = req.cookies.token;
    if (token) {
      await Blacklist.create({ token });
    }
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @name deleteUserController
 * @desc Controller to handle user deletion
 * @route GET /api/auth/delete
 * @access Public
 */
export async function deleteUserController(req, res) {
  try {
    const token = req.cookies.token;
    if (token) {
      await Blacklist.create({ token });
    }
    const userId = req.user.id;
    await User.findByIdAndDelete(userId);
    res.clearCookie("token");
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
