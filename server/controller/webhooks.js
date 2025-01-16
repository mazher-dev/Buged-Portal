import { Webhook } from "svix";
import User from "../models/user.js";

export const clearWebhooks = async (req, res) => {
    try {
        console.log("Webhook triggered:", req.body);

        // Initialize Webhook with Clerk secret
        const wbook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Verify the webhook signature
        const bodyString = JSON.stringify(req.body);
        wbook.verify(bodyString, {
            "swix-id": req.headers["swix-id"],
            "swix-timestamp": req.headers["swix-timestamp"],
            "swix-signature": req.headers["swix-signature"],
        });

        // Extract data and event type from payload
        const { data, type } = req.body;

        // Process event based on type
        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0]?.email_address || "",
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    image: data.image_url || "",
                    resume: "",
                };

                console.log("Creating new user:", userData);

                // Check if the user already exists to ensure idempotency
                const existingUser = await User.findById(data.id);
                if (existingUser) {
                    console.log("User already exists:", data.id);
                    return res.json({});
                }

                await User.create(userData);
                console.log("User created successfully:", data.id);
                res.json({});
                break;
            }

            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0]?.email_address || "",
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    image: data.image_url || "",
                };

                console.log("Updating user:", userData);

                // Update user data
                await User.findByIdAndUpdate(data.id, userData);
                console.log("User updated successfully:", data.id);
                res.json({});
                break;
            }

            case "user.deleted": {
                console.log("Deleting user:", data.id);

                // Delete the user
                await User.findByIdAndDelete(data.id);
                console.log("User deleted successfully:", data.id);
                res.json({});
                break;
            }

            default:
                console.log("Unhandled webhook event type:", type);
                res.status(400).json({ success: false, message: "Unknown event type" });
                break;
        }
    } catch (error) {
        console.error("Webhook processing error:", error.message);
        res.status(500).json({ success: false, message: "Webhooks Error" });
    }
};
