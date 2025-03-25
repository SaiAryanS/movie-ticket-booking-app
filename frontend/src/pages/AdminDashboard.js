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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Tab,
  Tabs,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [movies, setMovies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMovieId, setEditMovieId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [movieData, setMovieData] = useState({
    title: '',
    description: '',
    genre: '',
    duration: '',
    imageUrl: '',
  });
  
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.token) {
      fetchData();
    }
  }, [user?.token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      await Promise.all([fetchMovies(), fetchBookings()]);
    } catch (error) {
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMovies = async () => {
    const { data } = await axios.get('http://localhost:5000/api/movies', {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setMovies(data);
  };

  const fetchBookings = async () => {
    const { data } = await axios.get('http://localhost:5000/api/bookings', {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setBookings(data);
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      setError('');
      await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setBookings(bookings.filter(booking => booking._id !== bookingId));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete booking. Please try again.');
    }
  };

  const handleDeleteMovie = async (movieId) => {
    try {
      await axios.delete(`http://localhost:5000/api/movies/${movieId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      await fetchMovies();
    } catch (error) {
      setError('Failed to delete movie. Please try again.');
    }
  };

  const handleAddMovie = async () => {
    try {
      if (editMovieId) {
        await axios.put(
          `http://localhost:5000/api/movies/${editMovieId}`,
          movieData,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
      } else {
        await axios.post('http://localhost:5000/api/movies', movieData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      }
      setOpen(false);
      await fetchMovies();
      resetMovieForm();
    } catch (error) {
      setError('Failed to save movie. Please try again.');
    }
  };

  const handleEditMovie = (movie) => {
    setEditMovieId(movie._id);
    setMovieData({
      title: movie.title,
      description: movie.description,
      genre: movie.genre,
      duration: movie.duration,
      imageUrl: movie.imageUrl || '',
    });
    setOpen(true);
  };

  const resetMovieForm = () => {
    setEditMovieId(null);
    setMovieData({
      title: '',
      description: '',
      genre: '',
      duration: '',
      imageUrl: '',
    });
    setError('');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Movies" />
          <Tab label="Bookings" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              resetMovieForm();
              setOpen(true);
            }}
            sx={{ mb: 3 }}
          >
            Add New Movie
          </Button>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Genre</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Available Seats</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {movies.map((movie) => (
                  <TableRow key={movie._id}>
                    <TableCell>{movie.title}</TableCell>
                    <TableCell>{movie.genre}</TableCell>
                    <TableCell>{movie.duration}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${movie.availableSeats}/120`}
                        color={movie.availableSeats > 0 ? 'success' : 'error'}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditMovie(movie)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteMovie(movie._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={open} onClose={() => {
            setOpen(false);
            resetMovieForm();
          }} maxWidth="sm" fullWidth>
            <DialogTitle>{editMovieId ? 'Edit Movie' : 'Add New Movie'}</DialogTitle>
            <DialogContent>
              <Box component="form" sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Title"
                  value={movieData.title}
                  onChange={(e) => setMovieData({ ...movieData, title: e.target.value })}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Description"
                  value={movieData.description}
                  onChange={(e) => setMovieData({ ...movieData, description: e.target.value })}
                  margin="normal"
                  multiline
                  rows={4}
                  required
                />
                <TextField
                  fullWidth
                  label="Genre"
                  value={movieData.genre}
                  onChange={(e) => setMovieData({ ...movieData, genre: e.target.value })}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Duration (e.g., 2h 35m)"
                  value={movieData.duration}
                  onChange={(e) => setMovieData({ ...movieData, duration: e.target.value })}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Image URL"
                  value={movieData.imageUrl}
                  onChange={(e) => setMovieData({ ...movieData, imageUrl: e.target.value })}
                  margin="normal"
                  helperText="Enter a valid image URL (e.g., https://example.com/image.jpg)"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {
                setOpen(false);
                resetMovieForm();
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddMovie} 
                variant="contained" 
                disabled={!movieData.title || !movieData.description || !movieData.genre || !movieData.duration}
              >
                {editMovieId ? 'Update' : 'Add'} Movie
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      {tabValue === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Movie</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Seats</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Booking Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>{booking.movie.title}</TableCell>
                  <TableCell>{booking.user.name}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {booking.selectedSeats.map((seat, index) => (
                        <Chip
                          key={index}
                          label={seat}
                          size="small"
                          color={booking.status === 'confirmed' ? 'primary' : 'default'}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status}
                      color={booking.status === 'confirmed' ? 'success' : 'error'}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleDeleteBooking(booking._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
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

export default AdminDashboard;
