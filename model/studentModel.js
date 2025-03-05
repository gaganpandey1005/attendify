const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  contact: { type: String, required: true, unique: true, trim: true },
  joiningDate: { type: Date, required: true },
  feePayDate: { type: Date },
  batchName: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
});

// Use singular naming convention (MongoDB automatically pluralizes it)
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
