import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: Could not connect to MongoDB - ${error.message}`);
    process.exit(1); // Stop the server if the database fails
  }
};