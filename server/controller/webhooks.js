// webhooks.js
import { Webhook } from "svix";
import User from "../models/user.js";

export const clearWebhooks = async (req, res) => {
  try {
    const wbook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const reqBody = req.body;
    if (!reqBody) {
      return res.status(400).json({ error: "Missing request body" });
    }
    const { data, type } = reqBody;
    if (!data || !type) {
      return res.status(400).json({ error: "Invalid request body" });
    }
    await wbook.verify(JSON.stringify(reqBody), {
      "swix-id": req.headers["swix-id"],
      "swix-timestamp": req.headers["swix-timestamp"],
      "swix-signature": req.headers["swix-signature"],
    });
    // ...
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "Webhooks Error" });
  }
};