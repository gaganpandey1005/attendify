const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  batchName: { type: String, required: true,unique:true },
  date: { type: Date, required: true },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  student:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Student"
  }]
});

const Batch = mongoose.model("Batch", batchSchema); // ✅ Correct export

module.exports = Batch;
