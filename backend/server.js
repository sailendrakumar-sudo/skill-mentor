import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import profileRoutes from './routes/profiles.js';
import skillRoutes from './routes/skills.js';
import requestRoutes from './routes/requests.js';
import messageRoutes from './routes/messages.js';
import sessionRoutes from './routes/sessions.js';
import reviewRoutes from './routes/reviews.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../frontend/dist');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// CORS configuration (allow all origins so local tunnels, public URLs, and local dev all connect)
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'apikey', 'x-user-id']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.originalUrl.startsWith('/api')) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    }
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Skill Mentor API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Mount API Routes
app.use('/api/profiles', profileRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);

// Serve Static Frontend Assets from frontend/dist
if (fs.existsSync(distPath)) {
  console.log(`📦 Serving compiled frontend static assets from: ${distPath}`);
  app.use(express.static(distPath));

  // SPA Fallback for client-side routing (e.g. /discover, /dashboard, /recommendations)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// 404 Route Handler for undefined API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message || 'An unexpected error occurred'
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log('================================================================');
  console.log(`🚀 Skill Mentor Unified Server running at http://localhost:${PORT}`);
  console.log(`📡 Serves Frontend UI + Backend API on a single port!`);
  console.log(`🧠 AI Engine: Google Gemini active`);
  console.log(`⚡ Health check: http://localhost:${PORT}/api/health`);
  console.log('================================================================');
});
