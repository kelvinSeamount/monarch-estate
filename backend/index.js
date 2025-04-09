import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./route/auth.js";
import userRoute from "./route/user.js";
import cookieParser from "cookie-parser";
import listingRoute from "./route/listing.js";

const app = express();
dotenv.config();
app.use(cookieParser());

//Body parser
app.use(express.json());
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((err) => {
    console.log(err);
  });

//Listening Port
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

//Routes
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

app.use("api/listing", listingRoute);

//Middleware route
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  //message
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    message,
    success: false,
    statusCode,
  });
});
