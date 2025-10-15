// models/Doctor.js
import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sector: { type: String, required: true },
  hospital: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
});

export default mongoose.model("Doctor", doctorSchema);
