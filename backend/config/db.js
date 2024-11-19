// import mongoose from "mongoose";

// export const connectDB =async()=>{
//     (await mongoose.connect('mongodb+srv://greatstack:nups@cluster0.ov2zx.mongodb.net/food-del').then(()=>console.log("DB connected")));
// }

import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://greatstack:nups@cluster0.ov2zx.mongodb.net/food-del', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit the process if database connection fails
  }
};
