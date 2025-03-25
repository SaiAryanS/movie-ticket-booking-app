const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: false
  },
  availableSeats: {
    type: Number,
    required: true,
    default: 120,
    min: 0,
    max: 120
  }
}, {
  timestamps: true
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
