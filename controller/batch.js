const Batch = require("../model/batchModel");
const Teacher = require("../model/teacherModel");
const jwt = require("jsonwebtoken");

// ✅ Create Batch (using JWT from headers)
const createBatch = async (req, res) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const token = authHeader.split(" ")[1]; // Extract token
    const decoded = jwt.verify(token, process.env.secret_key); // Verify token
    const teacherId = decoded.id; // Extract teacherId from JWT payload

    const { batchName, date } = req.body;

    if (!batchName || !date) {
      return res
        .status(400)
        .json({ message: "Batch name and date are required" });
    }

    // 🔍 Check if the teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // 🔍 Check if batch already exists for this teacher
    const existingBatch = await Batch.findOne({
      batchName,
      teacher: teacherId,
    });
    if (existingBatch) {
      return res
        .status(400)
        .json({ message: "Batch Already Exists for this Teacher" });
    }

    // ✅ Create and save new batch
    const newBatch = new Batch({ batchName, date, teacher: teacherId });
    await newBatch.save();

    return res
      .status(201)
      .json({ message: "Batch Created Successfully!", batch: newBatch });
  } catch (error) {
    console.error("Error creating batch:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get Batches of a Teacher (Using JWT)
const getBatches = async (req, res) => {
  try {
    // Extract JWT from headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.secret_key);
    console.log("decoded",decoded);
    
    const teacherId = decoded.id;

    // 🔍 Validate if teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // 🔍 Find all batches associated with this teacher
    const batches = await Batch.find({ teacher: teacherId });

    if (batches.length === 0) {
      return res
        .status(404)
        .json({ message: "No Batches found for this Teacher" });
    }

    return res.status(200).json({ batches });
  } catch (err) {
    console.error("Error fetching batches:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { createBatch, getBatches };
