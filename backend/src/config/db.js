const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error(`[MongoDB Error] Failed to connect to MongoDB URI (${config.MONGO_URI})`);
    console.error(`[Troubleshooting]`);
    console.error(`1. If using local MongoDB, ensure MongoDB service is started (e.g. net start MongoDB or mongod).`);
    console.error(`2. If using MongoDB Atlas, replace MONGO_URI in your .env with your Atlas connection string:`);
    console.error(`   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/eventnest?retryWrites=true&w=majority`);
    throw err;
  }
};

module.exports = connectDB;
