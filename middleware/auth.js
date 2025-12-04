const Movie = require('../models/Movie');

// check if user is logged in
function isLoggedIn(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login'); // redirect to login if not authenticated
  }
  next();
}

// check if logged-in user owns movie
async function isOwner(req, res, next) {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).render('error', { 
        title: 'Not Found', 
        error: 'Movie not found' 
      });
    }
    if (movie.createdBy.toString() !== req.session.userId) {
      return res.status(403).render('error', { 
        title: 'Forbidden', 
        error: 'You cannot edit or delete this movie' 
      });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { 
      title: 'Error', 
      error: 'Authorization check failed' 
    });
  }
}

module.exports = { isLoggedIn, isOwner };
