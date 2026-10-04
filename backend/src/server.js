import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
  res.json({
    message: 'Project Management REST API is running',
    status: 'OK',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is healthy',
    database: process.env.MONGO_URI ? 'Connected' : 'Missing MONGO_URI'
  });
});

// Mount Application Routes (support both /api/* and root paths)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/projects', projectRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Start Server and verify DB connection
const startServer = async () => {
  try {
    if (process.env.MONGO_URI && process.env.MONGO_URI.trim() !== '') {
      await connectDB();
    } else {
      console.warn('⚠️ MONGO_URI is not set in backend/.env. Please configure your MongoDB credentials.');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(`Failed to start server: ${err.message}`);
  }
};

startServer();
