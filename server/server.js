import './config/instrument.js';
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import * as Sentry from "@sentry/node";
import { clearWebhooks } from './controller/webhooks.js';


// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Connect to the database
connectDB().then(() => console.log("Database connected successfully."));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("API Working"));
app.get("/debug-sentry", (req, res) => {
  throw new Error("Testing Sentry integration.");
});
app.post('/webhooks', clearWebhooks);

// Sentry error handler
Sentry.setupExpressErrorHandler(app);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
