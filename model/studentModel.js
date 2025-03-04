const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  contactNo: { type: String, required: true, trim: true, unique: true },
  joiningDate: { type: String, required: true },
  feePayDate: { type: String },
  attendDate: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attendance" }],
});

// Use singular naming convention (MongoDB automatically pluralizes it)
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
