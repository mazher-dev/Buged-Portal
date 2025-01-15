import { Webhook } from "svix";
import User from "../models/User.js";


// API Controller Function to Manage Clerk User with Database
const clerkWebhooks = async (req, res) => {
  try {
    // Create a Svix instance with clerk webhook Secret
    const svix = new Webhook(process.env.CLERR_WEBHOOK_SECRET);

    // Verifying Header
    await Webhook.verify(JSON.stringify(req.body), {
      "swix-id": req.headers["swix-id"],
      "swix-timestamp": req.headers["swix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // Getting Data from Request body
    const { data, type } = req.body;
    // Switch Case to Handle Different Webhook Events
    switch (type) {
      case "user.created": {
        const userData = {
            _id:data.id,
            email: data.email_addresses[0].email_address,
            name : data.first_name + " " + data.last_name,
            image : data.image_url,
            resume: ''
        }
        await User.create(userData)
        res.json({})
        break;
      }

      case "user.updated": {
        const userData = {
            email: data.email_addresses[0].email_address,
            name : data.first_name + " " + data.last_name,
            image : data.image_url,
        }
        await User.findByIdAndUpdate(data.id, userData)
        res.json({})
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id)
        res.json({})
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.log(error.message)
    res.json({success: false, messsage: 'Webhooks Error'})
  }
};

export default clerkWebhooks;