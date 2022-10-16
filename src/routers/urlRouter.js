import express from "express";
import {
  deleteUrl,
  ranking,
  redirectUrl,
  shortenUrl,
  showUrl,
  urlsUser,
} from "../controllers/urlsController.js";
import { tokenValidation } from "../middlewares/authMiddleware.js";
import { urlIsValid } from "../middlewares/urlMiddleware.js";

const router = express.Router();

router.post("/urls/shorten", tokenValidation, urlIsValid, shortenUrl);
router.get("/urls/:id", showUrl);
router.get("/urls/open/:shortUrl", redirectUrl);
router.delete("/urls/:id", tokenValidation, deleteUrl);
router.get("/users/me", tokenValidation, urlsUser);
router.get("/ranking", ranking);
export default router;
