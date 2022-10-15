import { signIn, signUp } from "../controllers/authController.js";
import express from "express";
import {
  signInValidation,
  signUpValidation,
} from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/signup", signUpValidation, signUp);
router.post("/signin", signInValidation, signIn);

export default router;
