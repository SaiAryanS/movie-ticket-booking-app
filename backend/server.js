const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/bookings', require('./routes/bookings'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Try to start the server with incremental ports
const startServer = async (initialPort) => {
  let currentPort = initialPort;
  const maxPort = 65535; // Maximum valid port number

  while (currentPort <= maxPort) {
    try {
      await new Promise((resolve, reject) => {
        const server = app.listen(currentPort, () => {
          console.log(`Server is running on port ${currentPort}`);
          resolve();
        });

        server.on('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            console.log(`Port ${currentPort} is busy, trying ${currentPort + 1}`);
            currentPort++;
            server.close();
          } else {
            reject(err);
          }
        });
      });
      break; // Server started successfully
    } catch (err) {
      if (currentPort >= maxPort) {
        console.error('No available ports found');
        process.exit(1);
      }
      // Continue to next port on error
      continue;
    }
  }
};

startServer(PORT);
