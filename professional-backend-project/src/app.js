import express from "express";
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

app.use(express.json({ limit: "16kb" }));

// url encoded
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// for file upload temp store
app.use(express.static("public"));
app.use(cookieParser);
// export default app
export { app };
