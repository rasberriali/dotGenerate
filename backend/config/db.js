const mongoose = require("mongoose");
require("dotenv").config(); // Ensure this is included at the top to load env variables from .env

const connectDB = async () => {
  try {
    // Connecting to MongoDB Atlas using the URI from environment variables
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB Atlas...");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

connectDB(); // Call the function to establish a connection

