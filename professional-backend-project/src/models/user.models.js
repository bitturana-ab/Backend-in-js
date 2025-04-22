import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// const userSchema = new mongoose.Schema({}, { timestamps: true });
// but here schema is imported

const userSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      trim: true,
      lowerCase: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      lowerCase: true,
      unique: true,
    },
    fullName: {
      type: String,
      require: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudnary url
      require: true,
    },
    coverImage: {
      type: String, //cloudnary url
    },
    watchHistory: [
      {
        typr: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: string,
      require: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// pre middleware for hashing password before save data
userSchema.pre("save", async function (next) {
  // ]password modification req or not
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
});
// custom method for encypt password compare
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
