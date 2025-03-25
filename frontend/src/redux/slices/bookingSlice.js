import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookings: [],
  selectedSeats: [],
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setBookings: (state, action) => {
      state.bookings = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedSeats: (state, action) => {
      state.selectedSeats = action.payload;
    },
    addBooking: (state, action) => {
      state.bookings.push(action.payload);
    },
    removeBooking: (state, action) => {
      state.bookings = state.bookings.filter(booking => booking._id !== action.payload);
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

export const { 
  setBookings, 
  setSelectedSeats, 
  addBooking, 
  removeBooking, 
  setLoading, 
  setError 
} = bookingSlice.actions;

export default bookingSlice.reducer;
