import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    salary: {
      type: String, // for ruppes / $ add
      //   type:Number
      require: true,
    },
    qualification: {
      type: String,
      require: true,
    },
    experienceInYear: {
      type: Number,
      default: 0,
    },
    workInHospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },
  },
  { timestamps: true }
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
