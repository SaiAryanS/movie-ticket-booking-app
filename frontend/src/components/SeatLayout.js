import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Typography, Alert, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import WeekendIcon from '@mui/icons-material/Weekend';
import axios from '../utils/axios';

const SeatLayout = ({ movieId, onSeatSelect, onClose }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seatsPerRow = 12;

  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const { data } = await axios.get(`/movies/${movieId}/seats`);
        setBookedSeats(data.bookedSeats || []);
        setLoading(false);
      } catch (err) {
        setError('Error fetching seat information');
        setLoading(false);
      }
    };

    fetchBookedSeats();
    // Set up polling to check for seat updates
    const interval = setInterval(fetchBookedSeats, 5000);
    return () => clearInterval(interval);
  }, [movieId]);

  const isSeatBooked = (seatId) => {
    return bookedSeats.includes(seatId);
  };

  const isSeatSelected = (seatId) => {
    return selectedSeats.includes(seatId);
  };

  const handleSeatClick = (seatId) => {
    if (isSeatBooked(seatId)) {
      setError('This seat is already booked');
      return;
    }

    setError('');
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      } else if (prev.length >= 5) {
        setError('You can only select up to 5 seats at a time');
        return prev;
      }
      return [...prev, seatId];
    });
  };

  const handleConfirm = async () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }

    // Verify seats are still available
    const nowBooked = selectedSeats.some(seat => bookedSeats.includes(seat));
    if (nowBooked) {
      setError('Some selected seats have been booked. Please choose different seats.');
      return;
    }

    try {
      onSeatSelect(selectedSeats);
    } catch (error) {
      setError('Failed to book seats. Please try again.');
    }
  };

  return (
    <>
      <DialogTitle>Select Seats</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom align="center">
            Screen
          </Typography>
          <Box
            sx={{
              width: '100%',
              height: '8px',
              bgcolor: 'primary.main',
              mb: 4,
              borderRadius: 1,
            }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={1} justifyContent="center">
            {rows.map((row) => (
              <Grid item xs={12} key={row}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Typography sx={{ width: 30 }}>{row}</Typography>
                  {Array.from({ length: seatsPerRow }, (_, index) => {
                    const seatId = `${row}${index + 1}`;
                    const isBooked = isSeatBooked(seatId);
                    const isSelected = isSeatSelected(seatId);

                    return (
                      <WeekendIcon
                        key={seatId}
                        sx={{
                          cursor: isBooked ? 'not-allowed' : 'pointer',
                          color: isBooked
                            ? 'text.disabled'
                            : isSelected
                            ? 'primary.main'
                            : 'action.active',
                          transform: 'scale(1.2)',
                          '&:hover': {
                            color: !isBooked && 'primary.light',
                          },
                        }}
                        onClick={() => handleSeatClick(seatId)}
                      />
                    );
                  })}
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Selected Seats: {selectedSeats.join(', ')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <WeekendIcon sx={{ color: 'action.active' }} />
                <Typography variant="caption">Available</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <WeekendIcon sx={{ color: 'primary.main' }} />
                <Typography variant="caption">Selected</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <WeekendIcon sx={{ color: 'text.disabled' }} />
                <Typography variant="caption">Booked</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          disabled={selectedSeats.length === 0}
        >
          Confirm Booking
        </Button>
      </DialogActions>
    </>
  );
};

export default SeatLayout;
