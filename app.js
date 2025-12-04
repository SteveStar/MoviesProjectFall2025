const express = require('express');
const mongoose = require('mongoose');
const movieRoutes = require('./routes/movies');
const methodOverride = require('method-override');
const session = require('express-session');// stores data, maintains state for user
const authRoutes = require('./routes/auth');  //fr user authentication
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// the middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(methodOverride('_method'));

//track logged in users
app.use(session({
  secret: 'supersecretkey', // use process.env.SECRET in production
  resave: false,
  saveUninitialized: false
}));

app.use('/movies', movieRoutes);
//for user authentication
app.use('/', authRoutes);


// this is the EJS template
app.set('view engine', 'ejs');
app.set('views', 'views');

// heres the home route
app.get('/', (req, res) => {
  res.redirect('/movies');
});

// added my own mongodb for the sake of simplicity; feel free to change it. user/pass are in the link
// mongoose.connect('mongodb+srv://dbUser:Password123@cluster0.t4bu3fl.mongodb.net/?appName=Cluster0')
// .then(() => {
//   console.log('Connected to MongoDB');
//   app.listen(3000, () => {
//     console.log('Server is running on port 3000');
//   });
// })
// .catch(err => {
//   console.error('MongoDB connection error:', err);
// });

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('YES! Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('NO! MongoDB connection error:', err);
});

module.exports = app;