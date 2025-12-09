import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import morgan from "morgan";

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// MongoDB Setup
const client = new MongoClient(process.env.MONGODB_URI);
let moviesCollection;

client.connect()
  .then(() => {
    const db = client.db("moviesDB");
    moviesCollection = db.collection("movies");
    console.log("✅ Connected to MongoDB");
    console.log(`📊 Using database: moviesDB, collection: movies`);
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });

// Validation function
function validateMovie(movie) {
  if (!movie.title || typeof movie.title !== "string") return "Invalid or missing title";
  if (!movie.director || typeof movie.director !== "string") return "Invalid or missing director";
  if (!movie.year || typeof movie.year !== "number" || movie.year < 1888) return "Invalid or missing year";
  return null;
}

// Middleware to ensure MongoDB connection is ready
app.use((req, res, next) => {
  if (!moviesCollection) {
    return res.status(503).json({ error: "Database connection not ready" });
  }
  next();
});

// Routes
// GET all movies (optional filtering)
app.get("/movies", async (req, res) => {
  try {
    const { title, director, year } = req.query;
    const filter = {};
    if (title) filter.title = title;
    if (director) filter.director = director;
    if (year) filter.year = parseInt(year);

    const movies = await moviesCollection.find(filter).toArray();
    res.json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

// GET one movie by id (supports both MongoDB _id and custom id)
app.get("/movies/:id", async (req, res) => {
  try {
    const idParam = req.params.id;
    let movie;

    // Try to find by MongoDB _id (ObjectId) first
    if (ObjectId.isValid(idParam)) {
      movie = await moviesCollection.findOne({ _id: new ObjectId(idParam) });
    }

    // If not found by _id, try custom id field (numeric)
    if (!movie) {
      const numericId = parseInt(idParam);
      if (!isNaN(numericId)) {
        movie = await moviesCollection.findOne({ id: numericId });
      }
    }

    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ error: "Failed to fetch movie" });
  }
});

// POST new movie
app.post("/movies", async (req, res) => {
  try {
    const newMovie = req.body;
    const error = validateMovie(newMovie);
    if (error) return res.status(400).json({ error });

    // Find the highest id from documents that have an id field
    const last = await moviesCollection
      .find({ id: { $exists: true, $ne: null, $type: "number" } })
      .sort({ id: -1 })
      .limit(1)
      .toArray();

    // Generate next id: if we found a document with id, increment it; otherwise start at 1
    newMovie.id = last.length > 0 && typeof last[0].id === "number"
      ? last[0].id + 1
      : 1;

    await moviesCollection.insertOne(newMovie);
    res.status(201).json(newMovie);
  } catch (error) {
    console.error("Error creating movie:", error);
    res.status(500).json({ error: "Failed to create movie" });
  }
});

// PUT update movie (supports both MongoDB _id and custom id)
app.put("/movies/:id", async (req, res) => {
  try {
    const idParam = req.params.id;
    const update = req.body;
    const error = validateMovie(update);
    if (error) return res.status(400).json({ error });

    let query = {};
    // Try MongoDB _id first, then custom id
    if (ObjectId.isValid(idParam)) {
      query = { _id: new ObjectId(idParam) };
    } else {
      const numericId = parseInt(idParam);
      if (!isNaN(numericId)) {
        query = { id: numericId };
      } else {
        return res.status(400).json({ error: "Invalid movie ID" });
      }
    }

    const result = await moviesCollection.updateOne(query, { $set: update });
    if (result.matchedCount === 0) return res.status(404).json({ error: "Movie not found" });

    const updatedMovie = await moviesCollection.findOne(query);
    res.json(updatedMovie);
  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(500).json({ error: "Failed to update movie" });
  }
});

// DELETE movie (supports both MongoDB _id and custom id)
app.delete("/movies/:id", async (req, res) => {
  try {
    const idParam = req.params.id;
    let query = {};

    // Try MongoDB _id first, then custom id
    if (ObjectId.isValid(idParam)) {
      query = { _id: new ObjectId(idParam) };
    } else {
      const numericId = parseInt(idParam);
      if (!isNaN(numericId)) {
        query = { id: numericId };
      } else {
        return res.status(400).json({ error: "Invalid movie ID" });
      }
    }

    const result = await moviesCollection.deleteOne(query);
    if (result.deletedCount === 0) return res.status(404).json({ error: "Movie not found" });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ error: "Failed to delete movie" });
  }
});

// Catch-all
app.use((req, res) => {
  res.status(404).send("Not Found");
});
