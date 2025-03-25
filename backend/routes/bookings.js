const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all bookings (admin only)
router.get('/', [auth, admin], async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('movie', 'title');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user bookings
router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie', 'title imageUrl');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { movieId, selectedSeats } = req.body;
    
    // Find the movie and check if seats are available
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if any of the selected seats are already booked
    const existingBooking = await Booking.findOne({
      movie: movieId,
      selectedSeats: { $in: selectedSeats },
      status: { $ne: 'cancelled' }
    });

    if (existingBooking) {
      return res.status(400).json({ 
        message: 'One or more selected seats are already booked. Please refresh and try again.' 
      });
    }

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      movie: movieId,
      numberOfSeats: selectedSeats.length,
      selectedSeats,
      bookingDate: new Date(),
      status: 'confirmed'
    });

    await booking.save();

    // Update movie's available seats
    movie.availableSeats = Math.max(0, movie.availableSeats - selectedSeats.length);
    await movie.save();

    res.status(201).json({ 
      message: 'Booking successful',
      booking: await booking.populate('movie', 'title imageUrl')
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
});

// Cancel booking
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns the booking or is admin
    if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Restore available seats
    const movie = await Movie.findById(booking.movie);
    if (movie) {
      movie.availableSeats = Math.min(120, movie.availableSeats + booking.numberOfSeats);
      await movie.save();
    }

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete booking (admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // If the booking was confirmed, restore the seats
    if (booking.status === 'confirmed') {
      const movie = await Movie.findById(booking.movie);
      if (movie) {
        movie.availableSeats = Math.min(120, movie.availableSeats + booking.numberOfSeats);
        await movie.save();
      }
    }

    await Booking.deleteOne({ _id: booking._id });
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ message: 'Failed to delete booking. Please try again.' });
  }
});

module.exports = router;
