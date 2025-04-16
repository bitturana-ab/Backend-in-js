import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({}, { timestamaos: true });

export const MedicalRecord = mongoose.model(
  "MedicalRecord",
  medicalRecordSchema
);
