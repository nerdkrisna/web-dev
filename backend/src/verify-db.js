import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testMongoConnection = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri || uri.trim() === '') {
    console.error('❌ Error: MONGO_URI is missing or empty in backend/.env');
    process.exit(1);
  }

  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📡 Host: ${conn.connection.host}`);
    console.log(`📁 Database Name: ${conn.connection.name}`);
    await mongoose.connection.close();
    console.log('🔒 Connection closed gracefully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:');
    console.error(error.message);
    process.exit(1);
  }
};

testMongoConnection();
