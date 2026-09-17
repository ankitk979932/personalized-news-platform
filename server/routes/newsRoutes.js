import express from "express";
import {
  getNews,
  getNewsById,
  getPersonalizedNews
} from "../controllers/newsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getNews);
router.get("/personalized", protect, getPersonalizedNews);
router.get("/:id", protect, getNewsById);

export default router;
