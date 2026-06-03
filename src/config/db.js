const mongoose = require("mongoose");
const { seedInitialData } = require("../services/seed.service");

async function connectDatabase() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/geekshop";

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });
  console.log("MongoDB conectado");
  await seedInitialData();
}

module.exports = { connectDatabase };
