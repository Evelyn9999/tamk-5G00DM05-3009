// 1. Import express
const express = require('express');
const app = express();

// 2. Middleware to parse JSON request bodies
app.use(express.json());

// 3. Default movie data
let movies = [
  { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
  { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999 },
  { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019 }
];

// ================================
// 4. Add the CRUD Routes
// ================================
// A. Default route: return all movies as a simple HTML list
app.get('/', (req, res) => {
  const html = `
    <h1>Movie Collection</h1>
    <ul>
      ${movies.map(movie => `<li>${movie.title} (${movie.year}) - Directed by ${movie.director}</li>`).join('')}
    </ul>
  `;
  res.send(html);
});

// B. GET /movies - return all movies in JSON
app.get('/movies', (req, res) => {
  res.json(movies);
});

// C. POST /movies - add a new movie
app.post('/movies', (req, res) => {
  const newMovie = req.body;

  if (!newMovie.title || !newMovie.director || !newMovie.year) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  newMovie.id = movies.length + 1;
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

// D. GET /movies/:id - get a movie by ID
app.get('/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find(m => m.id === id);

  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  res.json(movie);
});

// E. PUT /movies/:id - update a movie by ID
app.put('/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = movies.findIndex(movie => movie.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  const updatedMovie = {
    id,
    title: req.body.title,
    director: req.body.director,
    year: req.body.year
  };

  movies[index] = updatedMovie;
  res.json(updatedMovie);
});

// F. DELETE /movies/:id - delete a movie by ID
app.delete('/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = movies.findIndex(movie => movie.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  const deletedMovie = movies.splice(index, 1)[0]; // remove from array
  res.json({ message: 'Movie deleted successfully', deleted: deletedMovie });
});



// ================================

// 5. Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
