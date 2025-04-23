import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

// app.use(cors())
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
// limits for json in req

// app.use(express.json());
app.use(express.json({ limit: "16kb" }));

// url encoded
// app.use(express.urlencoded());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// for file upload temp store
app.use(express.static("public"));
app.use(cookieParser());
// routes import

import userRouter from "./routes/user.routes.js";

// routes decleration
// app.get(); // not uses any controller

// '/users' url control under userRouter

// app.use("/users", userRouter);
// use api defined routes
app.use("/api/v1/users", userRouter);

app.get("/ab", (req, res) => {
  res.send("ab is listening");
});

// export default app
export { app };
