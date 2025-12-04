const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET register form
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register', error: null });
});

// POST register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).render('register', { 
        title: 'Register', 
        error: 'All fields are required' 
      });
    }
    const user = new User({ username, password });
    await user.save();
    req.session.userId = user._id; // log in immediately after registration
    res.redirect('/movies');
  } catch (err) {
    res.status(400).render('register', { 
      title: 'Register', 
      error: 'Registration failed. Try a different username.' 
    });
  }
});

// GET login form
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login', error: null });
});

// POST login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).render('login', { 
        title: 'Login', 
        error: 'Invalid credentials' 
      });
    }
    req.session.userId = user._id;
    res.redirect('/movies');
  } catch (err) {
    res.status(500).render('login', { 
      title: 'Login', 
      error: 'Login failed' 
    });
  }
});

// GET logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
