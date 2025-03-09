const Batch = require("../model/batchModel");
const Student = require("../model/studentModel");
const jwt = require("jsonwebtoken");

const studentRegistration = async (req, res) => {
  try {
    const { name, joiningDate, contact, batchName } = req.body;

    // ✅ Correct token extraction
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.secret_key); // Ensure SECRET_KEY is correctly set
    const teacher = decoded.id;

    if (!teacher) {
      return res.status(400).json({ message: "No Teacher exists" });
    }

    console.log("Incoming data", req.body);

    // ✅ Validate required fields
    if (!name || !joiningDate || !contact || !batchName) {
      return res.status(400).json({ message: "All information required" });
    }

    // ✅ Check if student already exists
    const existingStudent = await Student.findOne({ contact });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }

    // ✅ Find the batch
    const batch = await Batch.findOne({ batchName });

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // ✅ Ensure `students` array exists
    if (!Array.isArray(batch.student)) {
      batch.student = [];
    }

    // ✅ Create new student
    const newStudent = new Student({
      name,
      joiningDate,
      contact,
      batch: batch._id, // Link to batch
      teacher, // Link to teacher from token
    });

    await newStudent.save();

    // ✅ Add student to batch
    batch.student.push(newStudent._id);
    await batch.save();

    res.status(201).json({
      message: "Student registered successfully",
      student: newStudent,
    });
  } catch (error) {
    console.error("Error in student registration:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getStudents = async (req, res) => {
  try {
    const { batchName } = req.query; // ✅ Use req.query instead of req.params

    // ✅ Validate batchName
    if (!batchName) {
      return res.status(400).json({ message: "Batch name is required" });
    }

    // ✅ Find batch and populate students
    const batch = await Batch.findOne({ batchName }).populate("student");

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.status(200).json({
      success: true,
      batchName: batch.batchName,
      students: batch.student || [],
      message:
        batch.student.length === 0
          ? "No students registered in this batch."
          : "Students retrieved successfully.",
    });
  } catch (error) {
    console.error("Error in fetching students:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    }); 
  }
};
const getFeeStatus = async (req, res) => {
  const { studentId,feePayStatus } = req.body;
  
  

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    student.feePayStatus = !student.feePayStatus;
    student.feePayDate=Date.now();
    student.save();
    
    
    return res
      .status(201)
      .json({
        message: "Student fee pay status updated",
        feePayStatus: student.feePayStatus,
      });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getAttendanceStatus = async (req, res) => {
  const { studentId,attendStatus } = req.body;
  console.log("incoming",req.body);
  
  

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    student.attendStatus = !student.attendStatus;
    student.attendDate=Date.now();
    student.save();
    console.log(student);
    
    return res
      .status(201)
      .json({
        message: "Student attendance status updated",
        attendStatus: student.attendStatus,
      });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { getAttendanceStatus, getFeeStatus, studentRegistration, getStudents };
