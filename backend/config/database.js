const mongoose = require('mongoose');

// Helper to safely mask credentials from URI for safe logging
const maskUri = (uri) => {
  if (!uri) return 'Not Provided';
  try {
    return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
  } catch (err) {
    return 'Masked URI';
  }
};

const connectDB = async () => {
  // If already connected, reuse existing connection pool
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookswap';


  try {
    const isAtlas = uri.includes('mongodb.net') || uri.startsWith('mongodb+srv://');
    console.log(`[Database] Attempting connection to ${isAtlas ? 'MongoDB Atlas' : 'MongoDB'} at ${maskUri(uri)}...`);

    const conn = await mongoose.connect(uri, {
      dbName: 'bookswap',
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`[Database] MongoDB Connected Successfully: Host = ${conn.connection.host}, DB = ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    if (process.env.MONGODB_URI && (process.env.MONGODB_URI.includes('mongodb.net') || process.env.MONGODB_URI.startsWith('mongodb+srv://'))) {
      console.warn('[Database Warning] MongoDB Atlas connection encountered an issue. Check network/IP whitelist or credentials.');
    }
    // Attempt fallback to local MongoDB if Atlas connection fails during dev
    if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'mongodb://127.0.0.1:27017/bookswap') {
      try {
        console.log('[Database] Attempting local MongoDB fallback at mongodb://127.0.0.1:27017/bookswap...');
        const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/bookswap', {
          serverSelectionTimeoutMS: 4000,
        });
        console.log(`[Database] Connected to local fallback database: ${localConn.connection.host}`);
        return localConn;
      } catch (localErr) {
        console.error(`[Database Fallback Error] Local fallback also failed: ${localErr.message}`);
      }
    }
    throw error;
  }
};

module.exports = connectDB;
