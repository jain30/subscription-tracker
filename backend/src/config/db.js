const mongoose = require('mongoose');
const env = require('./env');

/**
 * Establishes a MongoDB connection via Mongoose.
 * Connection only — no models or business logic.
 */
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(env.mongoUri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
