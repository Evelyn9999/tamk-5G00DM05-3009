import { movies, getNextMovieId } from "../config/db.js";
import { Movie } from "../models/movieModel.js";

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
    const { title, year } = req.body;
    const newMovie = new Movie(getNextMovieId(), title, year);

    movies.push(newMovie);
    res.status(201).json(newMovie);
};

export const updateMovie = (req, res) => {
    const id = Number(req.params.id);
    const movie = movies.find(m => m.id === id);

    if (!movie) return res.status(404).json({ error: "Movie not found" });

    movie.title = req.body.title;
    movie.year = req.body.year;
    res.json(movie);
};

export const deleteMovie = (req, res) => {
    const id = Number(req.params.id);
    const index = movies.findIndex(m => m.id === id);

    if (index === -1) return res.status(404).json({ error: "Movie not found" });

    movies.splice(index, 1);
    res.status(204).end();
};
