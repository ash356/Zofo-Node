import mongoose from "mongoose";
// Connection Database
const connectDB = async () => {
     return await mongoose.connect(process.env.DB_ATLAS)
          .then(result => {
               console.log(`MongoDB Connected...`);
          })
          .catch(error => {
               console.log(`MongoDB Connection Error...${error}`);
          })
}
export default connectDB;