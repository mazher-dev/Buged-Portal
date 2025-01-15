import { Webhook } from "svix";
import User from "../models/user";

const clerkWebhooks = async (req, res) => {
  try {
    // Create a Svix instance with Clerk Webhook Secret
    const svix = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verifying Webhook Request
    const payload = JSON.stringify(req.body);
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    svix.verify(payload, headers);

    // Extracting data and type from request body
    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url || "",
          resume: "",
        };
        await User.create(userData);
        return res.status(201).json({ success: true, message: "User created." });
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url || "",
        };
        await User.findByIdAndUpdate(data.id, userData, { new: true });
        return res.status(200).json({ success: true, message: "User updated." });
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        return res.status(200).json({ success: true, message: "User deleted." });
      }

      default:
        return res.status(400).json({ success: false, message: "Unknown event type." });
    }
  } catch (error) {
    console.error("Webhook Error:", error.message);
    return res.status(500).json({ success: false, message: "Webhook processing error." });
  }
};

export default clerkWebhooks;
