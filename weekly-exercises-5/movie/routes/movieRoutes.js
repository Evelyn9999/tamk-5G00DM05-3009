import express from "express";
import {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
} from "../controllers/movieController.js";

import validateMovie from "../middleware/validateMovie.js";

const router = express.Router();

router.get("/", getAllMovies);
router.get("/:id", getMovieById);

// 🔹 Apply Joi validation before controller
router.post("/", validateMovie, createMovie);
router.put("/:id", validateMovie, updateMovie);

router.delete("/:id", deleteMovie);

export default router;
