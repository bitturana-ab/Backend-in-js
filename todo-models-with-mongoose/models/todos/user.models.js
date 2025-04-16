import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      // custom message
      // required: [true, "password is required"],
      required: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
// mongoose DB name will ge "users" auto
