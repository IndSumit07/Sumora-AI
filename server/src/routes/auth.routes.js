import express from "express";
import {
  deleteUserController,
  loginUserController,
  logoutUserController,
  registerUserController,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post("/register", registerUserController);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
authRouter.post("/login", loginUserController);

/**
 * @route POST /api/auth/logout
 * @desc Logout a user
 * @access Public
 */
authRouter.post("/logout", logoutUserController);

/**
 * @route GET /api/auth/delete
 * @desc Delete a user
 * @access Public
 */
authRouter.get("/delete", deleteUserController);

export default authRouter;
