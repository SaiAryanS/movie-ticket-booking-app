import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await axios.get('http://localhost:5000/api/bookings/my', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBookings(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching your bookings');
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchBookings();
    }
  }, [user?.token]);

  const handleCancel = async (bookingId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/bookings/${bookingId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
    } catch (error) {
      setError(error.response?.data?.message || 'Error cancelling booking');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Bookings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && bookings.length === 0 ? (
        <Alert severity="info">You haven't made any bookings yet.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Movie</TableCell>
                <TableCell>Seats</TableCell>
                <TableCell>Booking Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>{booking.movie?.title}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {booking.selectedSeats.map((seat, index) => (
                        <Chip
                          key={index}
                          label={seat}
                          size="small"
                          color={booking.status === 'confirmed' ? 'primary' : 'default'}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status}
                      color={booking.status === 'confirmed' ? 'success' : 'error'}
                    />
                  </TableCell>
                  <TableCell>
                    {booking.status === 'confirmed' && (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleCancel(booking._id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default MyBookings;
