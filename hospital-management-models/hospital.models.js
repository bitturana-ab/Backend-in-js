import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    addreddLine1: {
      type: String,
      require: true,
    },
    addreddLine2: {
      type: String,
    },
    city: {
      type: String,
      require: true,
    },
    pincode: {
      type: String,
      require: true,
    },
    specializedIn: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export const Hospital = mongoose.model("Hospital", hospitalSchema);
