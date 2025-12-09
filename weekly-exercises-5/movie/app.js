import express from "express";
import movieRoutes from "./routes/movieRoutes.js";
import logger from "./middleware/logger.js";

const app = express();
app.use(express.json());
app.use(logger);

// root route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Movie API", endpoints: { movies: "/api/movies" } });
});

// mount router
app.use("/api/movies", movieRoutes);

// start
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
