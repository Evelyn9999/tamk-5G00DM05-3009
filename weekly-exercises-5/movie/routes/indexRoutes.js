import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: "Welcome to the Movie API",
        endpoints: { movies: "/api/movies" }
    });
});

export default router;

