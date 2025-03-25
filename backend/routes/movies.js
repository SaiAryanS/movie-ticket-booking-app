const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific movie
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get booked seats for a movie
router.get('/:id/seats', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({
      movie: req.params.id,
      status: { $ne: 'cancelled' }
    });
    
    const bookedSeats = bookings.reduce((seats, booking) => {
      return [...seats, ...booking.selectedSeats];
    }, []);

    res.json({ bookedSeats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new movie (admin only)
router.post('/', [auth, admin], async (req, res) => {
  try {
    const { title, description, genre, duration, imageUrl } = req.body;

    const movie = new Movie({
      title,
      description,
      genre,
      duration,
      imageUrl,
      availableSeats: 120
    });

    const savedMovie = await movie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a movie (admin only)
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const updates = req.body;
    Object.keys(updates).forEach((key) => {
      movie[key] = updates[key];
    });

    const updatedMovie = await movie.save();
    res.json(updatedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a movie (admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    await movie.remove();
    res.json({ message: 'Movie deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
