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
    const decoded = jwt.verify(token, process.env.secret_key);
    const teacher = decoded.id;

    if (!teacher) {
      return res.status(400).json({ message: "No Teacher exists" });
    }

    console.log("Incoming data", req.body);

    // ✅ Validate required fields
    if (!name || !joiningDate || !contact || !batchName) {
      return res.status(400).json({ message: "All information required" });
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
      batch: batch._id,
      teacher,
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
    const { batchName } = req.query;

    if (!batchName) {
      return res.status(400).json({ message: "Batch name is required" });
    }

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
  const { studentId, feePayStatus } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    student.feePayStatus = !student.feePayStatus;
    student.feePayDate = Date.now();
    await student.save();

    return res.status(201).json({
      message: "Student fee pay status updated",
      feePayStatus: student.feePayStatus,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAttendanceStatus = async (req, res) => {
  const { studentId, date } = req.body;
  console.log("Incoming request:", req.body);

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const currentStatus = student.attendance?.get(date) || false;
    const newStatus = !currentStatus;

    student.attendance.set(date, newStatus);

    await student.save();

    console.log("Updated student:", student);

    return res.status(201).json({
      message: "Student attendance status updated",
      attendStatus: newStatus,
    });
  } catch (err) {
    console.error("Error updating attendance status:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Save Attendance for a Batch
const saveAttendance = async (req, res) => {
  try {
    const { students } = req.body;
console.log(students);

    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "Invalid attendance data" });
    }

    for (const student of students) {
      const existingStudent = await Student.findById(student._id);
      if (!existingStudent) {
        continue;
      }

      existingStudent.attendance = student.attendance;
      await existingStudent.save();
    }

    return res.status(201).json({
      message: "Attendance saved successfully",
    });
  } catch (error) {
    console.error("Error saving attendance:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const saveFeeStatus = async (req, res) => {
  try {
    const { students } = req.body;

    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "Invalid attendance data" });
    }

    for (const student of students) {
      const existingStudent = await Student.findById(student._id);
      if (!existingStudent) {
        continue;
      }
      console.log(student.feePayDate,student.feePayStatus);
      

      existingStudent.feePayStatus = student.feePayStatus;
      await existingStudent.save();
    }

    return res.status(201).json({
      message: "Attendance saved successfully",
    });
  } catch (error) {
    console.error("Error saving attendance:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAttendanceStatus,
  getFeeStatus,
  studentRegistration,
  getStudents,
  saveAttendance,
  saveFeeStatus
};
