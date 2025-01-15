import './config/instrument.js';
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import * as Sentry from "@sentry/node";
import  clerkWebhooks  from './controller/webhooks.js';


dotenv.config();



// Initialize Express
const app = express();

// Connect to database

await connectDB();


// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("API Working"));
app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
  });
app.post('/webhooks',clerkWebhooks);



// Port
const port = process.env.PORT || 3000;
Sentry.setupExpressErrorHandler(app);
app.listen(port, () => console.log(`Server running on port ${port}`));
