const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Movie name is needed'],
    trim: true,
    maxlength: [100, 'Movie name cant exceed 100 chars']
  },
  description: {
    type: String,
    required: [true, 'Description is needed'],
    maxlength: [1000, 'Description cant exceed 1000 chars']
  },
  year: {
    type: Number,
    required: [true, 'Release year is needed'],
    min: [1888, 'Year must be after 1888'], // fun fact i had to look up when the first movie was made
    max: [new Date().getFullYear() + 5, 'Year cant be more than 5 years in the future']
  },
  genres: [{
    type: String,
    enum: [
      'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 
      'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Mystery',
      'Crime', 'Animation', 'Documentary', 'Family', 'Musical'
    ]
  }],
  rating: {
    type: Number,
    min: [0, 'Rating cant be less than 0'],
    max: [10, 'Rating cant be more than 10'],
    default: 0
  },
  // for the extra field, duration because why not
  duration: {
    type: Number,
    required: [true, 'Duration is needed'],
    min: [1, 'Duration needs to be at least 1 minute']
  }
}, {
  timestamps: true // adds createdAt and updatedAt fields
});

// index for better performance
movieSchema.index({ name: 1, year: -1 });

module.exports = mongoose.model('Movie', movieSchema);