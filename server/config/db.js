import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Listen for successful connection event
    mongoose.connection.on("connected", () => console.log("Database Connected"));

    // Connect to MongoDB using the connection string from environment variables
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Database connection successful");
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit the process if there's a failure
  }
};

export default connectDB;
