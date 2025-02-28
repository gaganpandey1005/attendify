const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  batchName: { type: String, required: true },
  date: { type: Date, required: true },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
});

const Batch = mongoose.model("Batch", batchSchema); // ✅ Correct export

module.exports = Batch;
