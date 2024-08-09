// require('dotenv')
//   .config({path:'./env'})
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
  path: "./env",
});
/*import express from "express";
const app = express();
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error",(error)=>{
      console.log("errr");
      throw  error
    })
    app.listen(process.env.PORT,()=>{
      console.log(`Listening on port ${process.env.PORT}`);
    })
  } catch (error) {
    console.log(error);
    throw error;
  }
})();
 */

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server Running at port : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Mongo Db connection failed!!`, error);
  });

