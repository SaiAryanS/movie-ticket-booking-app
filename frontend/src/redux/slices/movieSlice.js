import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  movies: [],
  selectedMovie: null,
  loading: false,
  error: null,
};

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setMovies: (state, action) => {
      state.movies = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setMovies, setSelectedMovie, setLoading, setError } = movieSlice.actions;
export default movieSlice.reducer;
