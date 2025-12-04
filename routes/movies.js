const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// middleware: user must be logged in
function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

// GET /movies, display all movies
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 });
        res.render('movies/index', {
            title: 'All Movies',
            movies
        });
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            error: 'Failed to fetch movies'
        });
    }
});

// GET /movies/new, show form to create new movie
router.get('/new', requireLogin, (req, res) => {
    res.render('movies/new', {
        title: 'Add New Movie',
        movie: {}
    });
});

// POST /movies, create a new movie
router.post('/', requireLogin, async (req, res) => {
    try {
        if (typeof req.body.genres === 'string') {
            req.body.genres = [req.body.genres];
        }

        const movie = new Movie(req.body);
        movie.user = req.session.user._id;

        await movie.save();
        res.redirect('/movies');
    } catch (error) {
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
        res.status(500).render('error', {
            title: 'Error',
            error: 'Failed to fetch movie'
        });
    }
});

// GET /movies/:id/edit, show edit form
router.get('/:id/edit', requireLogin, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).render('error', {
                title: 'Not Found',
                error: 'Movie not found'
            });
        }

        if (movie.user.toString() !== req.session.user._id) {
            return res.status(403).render('error', {
                title: 'Unauthorized',
                error: 'You are not allowed to edit this movie'
            });
        }

        res.render('movies/edit', {
            title: `Edit ${movie.name}`,
            movie
        });
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            error: 'Failed to fetch movie for editing'
        });
    }
});

// PUT /movies/:id, update the movie
router.put('/:id', requireLogin, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).render('error', {
                title: 'Not Found',
                error: 'Movie not found'
            });
        }

        if (movie.user.toString() !== req.session.user._id) {
            return res.status(403).render('error', {
                title: 'Unauthorized',
                error: 'You are not allowed to edit this movie'
            });
        }

        if (typeof req.body.genres === 'string') {
            req.body.genres = [req.body.genres];
        }

        await Movie.findByIdAndUpdate(req.params.id, req.body);
        res.redirect(`/movies/${req.params.id}`);
    } catch (error) {
        res.status(400).render('movies/edit', {
            title: 'Edit Movie',
            movie: req.body,
            error: 'Failed to update movie. Please check your input.'
        });
    }
});

// DELETE /movies/:id, delete movie
router.delete('/:id', requireLogin, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).render('error', {
                title: 'Not Found',
                error: 'Movie not found'
            });
        }

        if (movie.user.toString() !== req.session.user._id) {
            return res.status(403).render('error', {
                title: 'Unauthorized',
                error: 'You are not allowed to delete this movie'
            });
        }

        await Movie.findByIdAndDelete(req.params.id);
        res.redirect('/movies');
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            error: 'Failed to delete movie'
        });
    }
});

module.exports = router;
