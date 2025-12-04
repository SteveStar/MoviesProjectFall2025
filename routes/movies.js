const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const { isLoggedIn, isOwner } = require('../middleware/auth'); 

// GET /movies, display all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.render('movies/index', { 
      title: 'All Movies',
      movies 
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      title: 'Error',
      error: 'Failed to fetch movies' 
    });
  }
});

// GET /movies/new (restricted)
router.get('/new', isLoggedIn, (req, res) => {
  res.render('movies/new', { 
    title: 'Add New Movie',
    movie: {} 
  });
});

// POST /movies (restricted)
router.post('/', isLoggedIn, async (req, res) => {
  try {
    if (typeof req.body.genres === 'string') {
      req.body.genres = [req.body.genres];
    }
    const movie = new Movie({ ...req.body, createdBy: req.session.userId });
    await movie.save();
    res.redirect('/movies');
  } catch (error) {
    console.error(error);
    res.status(400).render('movies/new', {
      title: 'Add New Movie',
      movie: req.body,
      error: 'Failed to create movie. Please check your input.'
    });
  }
});

// GET /movies/:id, show single movie
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).render('error', {
        title: 'Not Found',
        error: 'Movie not found'
      });
    }
    res.render('movies/show', {
      title: movie.name,
      movie
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Error',
      error: 'Failed to fetch movie'
    });
  }
});

// GET /movies/:id/edit (restricted to owner)
router.get('/:id/edit', isLoggedIn, isOwner, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).render('error', {
        title: 'Not Found',
        error: 'Movie not found'
      });
    }
    res.render('movies/edit', {
      title: `Edit ${movie.name}`,
      movie
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Error',
      error: 'Failed to fetch movie for editing'
    });
  }
});

// PUT /movies/:id (restricted to owner)
router.put('/:id', isLoggedIn, isOwner, async (req, res) => {
  try {
    if (typeof req.body.genres === 'string') {
      req.body.genres = [req.body.genres];
    }
    await Movie.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/movies/${req.params.id}`);
  } catch (error) {
    console.error(error);
    res.status(400).render('movies/edit', {
      title: 'Edit Movie',
      movie: req.body,
      error: 'Failed to update movie. Please check your input.'
    });
  }
});

// DELETE /movies/:id (restricted to owner)
router.delete('/:id', isLoggedIn, isOwner, async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.redirect('/movies');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Error',
      error: 'Failed to delete movie'
    });
  }
});

module.exports = router;
