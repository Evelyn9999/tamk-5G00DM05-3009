const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(morgan('dev'));

let movies = [
  { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
  { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999 },
  { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019 }
];

// Helper: validate movie
function isValidMovie({ title, director, year }) {
  return (
    title &&
    director &&
    typeof year === 'number' &&
    year >= 1888 &&
    year <= new Date().getFullYear()
  );
}

// GET all
app.get('/movies', (req, res) => {
  res.json(movies);
});

// GET by ID
app.get('/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find(m => m.id === id);
  if (!movie) return res.status(404).json({ error: 'Movie not found' });
  res.json(movie);
});

// POST
app.post('/movies', (req, res) => {
  const movie = req.body;
  if (!isValidMovie(movie)) {
    return res.status(400).json({ error: 'Invalid movie data' });
  }
  movie.id = movies.length + 1;
  movies.push(movie);
  res.status(201).json(movie);
});

// PUT
app.put('/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = movies.findIndex(m => m.id === id);
  if (index === -1) return res.status(404).json({ error: 'Movie not found' });

  const updated = req.body;
  if (!isValidMovie(updated)) {
    return res.status(400).json({ error: 'Invalid movie data' });
  }

  updated.id = id;
  movies[index] = updated;
  res.json(updated);
});

// DELETE
app.delete('/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = movies.findIndex(m => m.id === id);
  if (index === -1) return res.status(404).json({ error: 'Movie not found' });

  movies.splice(index, 1);
  res.status(204).end();
});

// Catch-all route
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
