require("dotenv").config(); // Load environment variables
const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    
  } catch (err) {
    console.error(" MongoDB Connection Error:", err);
    process.exit(1); // Exit if connection fails
  }
};

module.exports = connectDb;
