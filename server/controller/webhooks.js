import { Webhook } from "svix";
import User from "../models/user.js";

export const clearWebhooks = async (req, res) => {
    try {

        const wbook =  new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        await whook.verify(JSON.stringify(req.body),{
            "swix-id": req.headers["swix-id"],
            "swix-timestamp": req.headers["swix-timestamp"],
            "swix-signature": req.headers["swix-signature"]
        })


        const { data , type } = req.body;

        switch(type){
            case "user.created":{
                
                const userData = {
                    _id:data.id,
                    email: data.email_addresses[0].email_address,
                    name : data.first_name + " " + data.last_name,
                    image : data.image_url,
                    resume: ""
                }
                await User.create(userData)
                res.json({})
                break;
            }
            case "user.updated":{
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name : data.first_name + " " + data.last_name,
                    image : data.image_url,
                }
                await User.findByIdAndUpdate(data.id, userData)
                res.json({})
                break;

            }
            case "user.deleted":{
                await User.findByIdAndDelete(data.id)
                res.json({})
                break;
            }
            default:
                break;
        }
    } catch (error) {
        console.log(error.message)
        res.json({sucess:false,message:"Webhooks Error"})
    }
}