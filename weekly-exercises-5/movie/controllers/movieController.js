import { movies, getNextMovieId } from "../config/db.js";
import { Movie } from "../models/movieModel.js";
import Joi from "joi";

// Joi schema for validation (controller-level)
const movieSchema = Joi.object({
    title: Joi.string().min(1).max(100).required(),
    year: Joi.number().integer().min(1888).max(2100).required()
});

export const getAllMovies = (req, res) => {
    res.json(movies);
};

export const getMovieById = (req, res) => {
    const id = Number(req.params.id);
    const movie = movies.find(m => m.id === id);

    if (!movie) return res.status(404).json({ error: "Movie not found" });

    res.json(movie);
};

export const createMovie = (req, res) => {
    // Controller-level validation with Joi
    const { error, value } = movieSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const details = error.details.map(d => d.message);
        return res.status(400).json({
            error: "Validation failed",
            details
        });
    }

    // Use validated value
    const { title, year } = value;
    const newMovie = new Movie(getNextMovieId(), title, year);

    movies.push(newMovie);
    res.status(201).json(newMovie);
};

export const updateMovie = (req, res) => {
    const id = Number(req.params.id);
    const movie = movies.find(m => m.id === id);

    if (!movie) return res.status(404).json({ error: "Movie not found" });

    // Controller-level validation with Joi
    const { error, value } = movieSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const details = error.details.map(d => d.message);
        return res.status(400).json({
            error: "Validation failed",
            details
        });
    }

    // Use validated value
    movie.title = value.title;
    movie.year = value.year;
    res.json(movie);
};

export const deleteMovie = (req, res) => {
    const id = Number(req.params.id);
    const index = movies.findIndex(m => m.id === id);

    if (index === -1) return res.status(404).json({ error: "Movie not found" });

    movies.splice(index, 1);
    res.status(204).end();
};
