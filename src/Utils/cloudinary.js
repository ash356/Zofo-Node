import * as dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });
import cloudinary from "cloudinary";
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secret: true,
});
// console.log(process.env.CLOUD_NAME);
// console.log(process.env.API_KEY);
// console.log(process.env.API_SECRET);
export default cloudinary.v2;
