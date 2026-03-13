import jwt from "jsonwebtoken";
import Blacklist from "../models/blacklist.model.js";

/**
 * @name authMiddleware
 * @desc Middleware to protect routes and verify JWT tokens
 * @access Private
 */
export async function authMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const isTokenBlacklisted = await Blacklist.findOne({ token });

  if (isTokenBlacklisted) {
    return res.status(401).json({ message: "Token has been revoked." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
}
