const Batch = require("../model/batchModel");
const Student = require("../model/studentModel");
const jwt = require("jsonwebtoken");

// * Student Registration Controller
const studentRegistration = async (req, res) => {
  try {
    const { name, joiningDate, contact, batchName } = req.body;

    // * ✅ Extract token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      // ! Token missing
      return res.status(401).json({ message: "No token provided" });
    }

    // * ✅ Verify JWT token
    const decoded = jwt.verify(token, process.env.secret_key);
    const teacher = decoded.id;

    if (!teacher) {
      // ! Teacher not present in token
      return res.status(400).json({ message: "No Teacher exists" });
    }

    // * ✅ Required field validation
    if (!name || !joiningDate || !contact || !batchName) {
      return res.status(400).json({ message: "All information required" });
    }

    // * ✅ Find batch by name
    const batch = await Batch.findOne({ batchName });

    if (!batch) {
      // ! Batch does not exist
      return res.status(404).json({ message: "Batch not found" });
    }

    // * ✅ Ensure student array exists
    if (!Array.isArray(batch.student)) {
      batch.student = [];
    }

    // * ✅ Create new student
    const newStudent = new Student({
      name,
      joiningDate,
      contact,
      batch: batch._id,
      teacher,
    });

    await newStudent.save();

    // * ✅ Add student to batch and save
    batch.student.push(newStudent._id);
    await batch.save();

    res.status(201).json({
      message: "Student registered successfully",
      student: newStudent,
    });
  } catch (error) {
    console.error("Error in student registration:", error);
    // ! Internal Server Error
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// * Get all students in a batch
const getStudents = async (req, res) => {
  try {
    const { batchName } = req.query;

    if (!batchName) {
      // ! Missing batch name in query
      return res.status(400).json({ message: "Batch name is required" });
    }

    const batch = await Batch.findOne({ batchName }).populate("student");

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.status(200).json({
      success: true,
      batchName: batch.batchName,
      batchId: batch._id,
      students: batch.student || [],
      message:
        batch.student.length === 0
          ? "No students registered in this batch."
          : "Students retrieved successfully.",
    });
  } catch (error) {
    console.error("Error in fetching students:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// * Toggle fee payment status
const getFeeStatus = async (req, res) => {
  const { studentId } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // * Toggle fee status and update date
    student.feePayStatus = !student.feePayStatus;
    student.feePayDate = Date.now();
    await student.save();

    return res.status(201).json({
      message: "Student fee pay status updated",
      feePayStatus: student.feePayStatus,
    });
  } catch (err) {
    // ! Error updating fee
    return res.status(500).json({ message: "Internal server error" });
  }
};

// * Toggle attendance status for a specific date
const getAttendanceStatus = async (req, res) => {
  const { studentId, date } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const currentStatus = student.attendance?.get(date) || false;
    const newStatus = !currentStatus;

    student.attendance.set(date, newStatus);
    await student.save();

    return res.status(201).json({
      message: "Student attendance status updated",
      attendStatus: newStatus,
    });
  } catch (err) {
    console.error("Error updating attendance status:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// * Save entire attendance data (bulk update)
const saveAttendance = async (req, res) => {
  try {
    const { students } = req.body;

    if (!students || !Array.isArray(students) || students.length === 0) {
      // ! Invalid or empty data
      return res.status(400).json({ message: "Invalid attendance data" });
    }

    for (const student of students) {
      const existingStudent = await Student.findById(student._id);
      if (!existingStudent) continue;

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

// * Save fee status for all students (bulk)
const saveFeeStatus = async (req, res) => {
  try {
    const { students } = req.body;

    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "Invalid attendance data" });
    }

    for (const student of students) {
      const existingStudent = await Student.findById(student._id);
      if (!existingStudent) continue;

      existingStudent.feePayStatus = student.feePayStatus;
      existingStudent.feePayDate = student.feePayDate;
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

// * Delete student by ID and remove from batch
const deleteStudents = async (req, res) => {
  const { id } = req.params;
  const { batchName } = req.body;

  try {
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    // * Remove student from batch's student list
    const updateBatch = await Batch.findOneAndUpdate(
      { batchName },
      { $pull: { student: id } }, // ✅ Pull student ID from array
      { new: true }
    );

    console.log(updateBatch);

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, contact },
      { new: true } // return the updated document
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @ Export all controller functions
module.exports = {
  getAttendanceStatus,
  getFeeStatus,
  studentRegistration,
  getStudents,
  saveAttendance,
  saveFeeStatus,
  deleteStudents,
  updateStudent
};
