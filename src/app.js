import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import ApiResponse from "./utils/ApiResponse.js";

const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({
  limit: "16kb",
}));
app.use(express.urlencoded({
  extended: true,
  limit: "16kb",
}));
app.use(express.static("public"));
app.use(cookieParser());
//Routes Import
import userRouter from "./routes/user.routes.js";
//Default export can be named Anything
//Router alag kardiye
app.use("/api/v1/users", userRouter);

// app.get("/api/v1", (req, res) => {
//   const response = new ApiResponse(200, "Welcome", "GET REQ IS WORKING");
//   res.json(response);
// });
export { app };
