import express from "express";
import {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
} from "../controllers/movieController.js";

import validateMovie from "../middleware/validateMovie.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllMovies);
router.get("/:id", getMovieById);

// 🔹 Apply Joi validation before controller
router.post("/", authMiddleware, validateMovie, createMovie);
router.put("/:id", authMiddleware, validateMovie, updateMovie);
router.delete("/:id", authMiddleware, deleteMovie);

export default router;
