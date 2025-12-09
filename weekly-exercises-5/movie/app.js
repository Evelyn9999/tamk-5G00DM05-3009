import express from "express";
import movieRoutes from "./routes/movieRoutes.js";
import indexRoutes from "./routes/indexRoutes.js";
import logger from "./middleware/logger.js";

const app = express();
app.use(express.json());
app.use(logger);

// mount routers
app.use("/", indexRoutes);
app.use("/api/movies", movieRoutes);

// start
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
