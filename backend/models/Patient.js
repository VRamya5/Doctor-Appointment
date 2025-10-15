// models/Patient.js
import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  age: Number,
});

export default mongoose.model("Patient", patientSchema);
