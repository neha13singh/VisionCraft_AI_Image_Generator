import express from "express";
import { createPost, getAllPosts, testCloudinary } from "../controllers/Posts.js";
import { validatePost } from '../middleware/validate.js';

const router = express.Router();

router.get("/", getAllPosts);
router.post("/", validatePost, createPost);
router.get("/test-cloudinary", testCloudinary);

export default router;
