import jwt from "jsonwebtoken";
import Blacklist from "../models/blacklist.model.js";
import { redis, CACHE_KEYS, CACHE_TTL, cacheGet, cacheSet } from "../services/redis.service.js";

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

  // Check Redis cache first, fallback to DB
  const cacheKey = CACHE_KEYS.blacklist(token);
  let isBlacklisted = await cacheGet(cacheKey);

  if (isBlacklisted === null) {
    const dbEntry = await Blacklist.findOne({ token });
    isBlacklisted = !!dbEntry;
    // Cache the result (negative caching too) for 24 hours
    await cacheSet(cacheKey, isBlacklisted, CACHE_TTL.BLACKLIST);
  }

  if (isBlacklisted) {
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
