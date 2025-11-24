const express = require('express');
const mongoose = require('mongoose');
const movieRoutes = require('./routes/movies');
const methodOverride = require('method-override');
const app = express();

// this is the EJS template
app.set('view engine', 'ejs');
app.set('views', 'views');

// the middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(methodOverride('_method'));

// have the routes below with one another
app.use('/movies', movieRoutes);

// heres the home route
app.get('/', (req, res) => {
  res.redirect('/movies');
});

// added my own mongodb for the sake of simplicity; feel free to change it. user/pass are in the link
mongoose.connect('mongodb+srv://dbUser:Password123@cluster0.t4bu3fl.mongodb.net/?appName=Cluster0')
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});

module.exports = app;