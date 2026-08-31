const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb+srv://saransh_db_user:ODXApq9GjQKL3fHy@cluster0.ujbmkvf.mongodb.net/pathRecommender';
    console.log(`Connecting to MongoDB at: ${connUri}...`);

    // Attempt local MongoDB connection with short timeout
    const options = {
      serverSelectionTimeoutMS: 3000
    };

    await mongoose.connect(connUri, options);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`Local MongoDB connection failed (${error.message}). Starting MongoMemoryServer fallback...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`InMemory MongoDB Connected: ${memoryUri}`);
    } catch (memErr) {
      console.error(`Error starting MongoMemoryServer: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
