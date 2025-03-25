import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Box,
  Alert,
  CircularProgress,
  Dialog,
} from '@mui/material';
import axios from '../utils/axios';
import SeatLayout from '../components/SeatLayout';

const MovieDetails = () => {
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [openSeatDialog, setOpenSeatDialog] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const { data } = await axios.get(`/movies/${id}`);
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie:', error);
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleBookingStart = () => {
    setOpenSeatDialog(true);
  };

  const handleSeatSelect = async (selectedSeats) => {
    try {
      setBookingLoading(true);
      setError('');
      
      await axios.post('/bookings', {
        movieId: id,
        selectedSeats,
      });

      setBookingSuccess(true);
      setOpenSeatDialog(false);
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    } catch (error) {
      console.error('Booking error:', error);
      setError(error.response?.data?.message || 'Failed to book movie');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!movie) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Movie not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <img
              src={movie.imageUrl}
              alt={movie.title}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: 8,
              }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              {movie.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              Genre: {movie.genre}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              Duration: {movie.duration} minutes
            </Typography>
            <Typography variant="body1" paragraph>
              {movie.description}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              Available Seats: {movie.availableSeats}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {bookingSuccess ? (
              <Alert severity="success">
                Booking successful! Redirecting to your bookings...
              </Alert>
            ) : (
              <Button
                variant="contained"
                size="large"
                onClick={handleBookingStart}
                disabled={bookingLoading || movie.availableSeats === 0}
                sx={{ mt: 2 }}
              >
                {bookingLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : movie.availableSeats === 0 ? (
                  'Sold Out'
                ) : (
                  'Book Now'
                )}
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Dialog
        open={openSeatDialog}
        onClose={() => setOpenSeatDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <SeatLayout
          movieId={id}
          onSeatSelect={handleSeatSelect}
          onClose={() => setOpenSeatDialog(false)}
        />
      </Dialog>
    </Container>
  );
};

export default MovieDetails;
