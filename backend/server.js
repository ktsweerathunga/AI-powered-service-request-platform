import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import morgan from 'morgan';

import requestRoutes from './routes/requests.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // We'll restrict this later to the frontend URL
    methods: ['GET', 'POST', 'PUT']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Inject Socket.io into requests so we can emit events from routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/requests', requestRoutes);

// Socket.io Connection
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// Database connection
const PORT = process.env.PORT || 5001; // Changed to 5001 to avoid Mac AirPlay conflict on 5000
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/service_platform_fallback";

// If the user hasn't replaced the .env template yet, fallback safely
if (MONGODB_URI === "your_mongodb_connection_string_here") {
  MONGODB_URI = "mongodb://localhost:27017/service_platform_fallback";
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log(`Connected to MongoDB at ${MONGODB_URI}`);
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    // Continue running server even if DB connection fails to allow basic ping
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (Running without DB)`);
    });
  });
