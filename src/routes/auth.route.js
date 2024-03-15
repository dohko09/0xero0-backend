import express from "express";
const router = express.Router();
import {
  register,
  login,
  resetPassword,
} from "../controllers/auth.controller.js";

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);

export default router;
