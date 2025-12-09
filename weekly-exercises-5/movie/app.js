import express from "express";
import morgan from "morgan";
import movieRoutes from "./routes/movieRoutes.js";
import indexRoutes from "./routes/indexRoutes.js";
import logger from "./middleware/logger.js";

const app = express();

// Parse JSON body
app.use(express.json());

// 🔹 HTTP logger (morgan)
app.use(morgan("dev"));

// 🔹 Middleware logger
app.use(logger);

// Mount routes
app.use("/", indexRoutes);
app.use("/api/movies", movieRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
