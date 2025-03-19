const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  contact: { type: String, required: true, trim: true },
  joiningDate: { type: Date, required: true },
  feePayDate: { type: Date },
  feePayStatus: { type: Boolean, default: false },
  batchName: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  attendance: {
    type: Map,
    of: Boolean, // Store attendance status as boolean values
    default: {},
  },
});

// Use singular naming convention (MongoDB automatically pluralizes it)
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
