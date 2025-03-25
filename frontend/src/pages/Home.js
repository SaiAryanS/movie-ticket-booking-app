import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from '../utils/axios';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await axios.get('/movies');
        setMovies(data);
      } catch (error) {
        setError('Failed to load movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleBookNow = (movieId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/movies/${movieId}` } });
    } else {
      navigate(`/movies/${movieId}`);
    }
  };

  const scrollToMovies = () => {
    const moviesSection = document.getElementById('movies-section');
    if (moviesSection) {
      moviesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Landing Section */}
      <Box
        sx={{
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://source.unsplash.com/1600x900/?movie,cinema")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          textAlign: 'center',
          padding: 4,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Movie Booking
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Book your favorite movies with just a few clicks
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={scrollToMovies}
          sx={{
            fontSize: '1.2rem',
            padding: '12px 32px',
          }}
        >
          Now Showing
        </Button>
      </Box>

      {/* Movies Section */}
      <Container id="movies-section" maxWidth="lg" sx={{ py: 8 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          {movies.map((movie) => (
            <Grid item key={movie._id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                  bgcolor: 'background.paper',
                }}
              >
                <CardMedia
                  component="div"
                  sx={{
                    pt: '150%', // 2:3 aspect ratio
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={movie.imageUrl}
                    alt={movie.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </CardMedia>
                <CardContent sx={{ flexGrow: 1, bgcolor: 'background.paper' }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {movie.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Genre: {movie.genre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Duration: {movie.duration} minutes
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {movie.description.length > 150
                      ? `${movie.description.substring(0, 150)}...`
                      : movie.description}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleBookNow(movie._id)}
                    disabled={movie.availableSeats === 0}
                    sx={{ mt: 2 }}
                  >
                    {movie.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
