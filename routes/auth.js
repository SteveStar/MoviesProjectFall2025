const express = require('express');
const router = express.Router();
const User = require('../models/User');

// register form
router.get('/register', (req, res) => {
    res.render('auth/register', { 
        title: 'Register',
        errors: [], 
        formData: {} 
    });
});

// register submit
router.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    let errors = [];

    if (!username) errors.push('Username is required');
    if (!email) errors.push('Email is required');
    if (!password) errors.push('Password is required');
    if (password !== confirmPassword) errors.push('Passwords do not match');

    if (errors.length > 0) {
        return res.render('auth/register', {
            title: 'Register',
            errors,
            formData: { username, email }
        });
    }

    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            errors.push('Email is already registered');
            return res.render('auth/register', {
                title: 'Register',
                errors,
                formData: { username, email }
            });
        }

        const user = new User({ username, email, password });
        await user.save();

        req.session.user = user;
        res.redirect('/movies');

    } catch (error) {
        let errorsArr = [];

        if (error.errors) {
            for (let field in error.errors) {
                errorsArr.push(error.errors[field].message);
            }
        } else {
            errorsArr.push('Registration failed');
        }

        res.render('auth/register', {
            title: 'Register',
            errors: errorsArr,
            formData: { username, email }
        });
    }
});

// login form
router.get('/login', (req, res) => {
    res.render('auth/login', { 
        title: 'Login',
        errors: [] 
    });
});

// login submit
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    let errors = [];

    if (!email || !password) {
        errors.push('Email and password are required');
        return res.render('auth/login', { 
            title: 'Login',
            errors 
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            errors.push('Invalid email or password');
            return res.render('auth/login', { 
                title: 'Login',
                errors 
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            errors.push('Invalid email or password');
            return res.render('auth/login', { 
                title: 'Login',
                errors 
            });
        }

        req.session.user = user;
        res.redirect('/movies');

    } catch (err) {
        res.render('auth/login', { 
            title: 'Login',
            errors: ['Login failed'] 
        });
    }
});

// logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;
