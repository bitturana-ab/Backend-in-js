// require("dotenv").config({ path: "./env" });
import dotenv from "dotenv";

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";
import express from "express";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});

const app = express();

// async return apromise
connectDB()
  .then(() => {
    console.log("connected to db");
    // no need this
    app.on("error", (error) => {
      console.log("Error: ", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`app running on port :${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed !!! ", err);
  });

// routes

app.get("/", (req, res) => {
  res.send("app is running");
});
// lets mongoDB connection code will be inside DB folder
/*
// execute soon and async for no error
// ()()

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("ERROR", (error) => {
      console.log("ERROR: ", error);
      throw error;
    });
    app.listen(process.env.PORT, () => {
      console.log(`app is running on port: ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Error:", error);
  }
})();

// function connectDB() {}

// connectDB();


*/
