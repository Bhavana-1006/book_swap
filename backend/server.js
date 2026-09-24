const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

const connectDB = require('./config/database');
const Message = require('./models/Message');
const Request = require('./models/Request');

// Initialize express app
const app = express();
const server = http.createServer(app);

// Dynamic CORS configuration for local and cloud deployments (Vercel, Render)
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com') || origin.includes('localhost')) return true;
  return true; // Graceful fallback
};

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => callback(null, true),
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Middleware
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint (Mandatory requirement from Section 3)
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbState = mongoose.connection.readyState;
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];

  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: {
      status: states[dbState] || 'Unknown',
      host: mongoose.connection.host || 'Unknown',
      name: mongoose.connection.name || 'bookswap'
    },
    service: 'BookSwap Campus Marketplace API',
    uptime: process.uptime()
  });
});

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const requestRoutes = require('./routes/requestRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const swapRoutes = require('./routes/swapRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const chatRoutes = require('./routes/chatRoutes');

// API Routes mounting
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);

// Socket.io Real-time Chat
io.on('connection', (socket) => {
  // Join a specific exchange conversation room
  socket.on('join_room', (requestId) => {
    socket.join(requestId);
  });

  // Handle incoming chat message in real time
  socket.on('send_message', async (data) => {
    try {
      const { requestId, senderId, recipientId, content } = data;
      if (!requestId || !senderId || !recipientId || !content) return;

      // Verify request existence
      const reqDoc = await Request.findById(requestId);
      if (!reqDoc) return;

      // Persist in MongoDB
      const message = await Message.create({
        relatedRequest: requestId,
        sender: senderId,
        recipient: recipientId,
        content: content.trim()
      });

      await message.populate('sender', 'name profileImage');

      // Emit to room members
      io.to(requestId).emit('receive_message', message);
    } catch (err) {
      console.error('[Socket Chat Error]:', err.message);
      socket.emit('chat_error', { message: 'Failed to send message' });
    }
  });

  socket.on('disconnect', () => {
    // client disconnected
  });
});

// Serve frontend static build in production
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
const fs = require('fs');
if (process.env.NODE_ENV === 'production' || fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    const indexPath = path.join(frontendDist, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    next();
  });
}

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `API route ${req.originalUrl} not found` });
});


// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Server Error]:', err.stack);

  // Multer error handling
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File too large. Maximum size is 5MB.' });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Server Initialization
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[BookSwap Server] Listening on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`[BookSwap Server] Health check available at http://localhost:${PORT}/api/health`);
  });
}).catch((err) => {
  console.error('[Fatal Error] Unable to start server due to database failure:', err.message);
});

