const express = require("express");
const {
  studentRegistration,
  getStudents,
  getFeeStatus,
  getAttendanceStatus,
  saveAttendance,
  saveFeeStatus,
  deleteStudents,
  updateStudent,
} = require("../controller/student");
const router = express.Router();

router.post("/studentRegistration", studentRegistration);
router.post("/saveAttendance", saveAttendance);
router.post("/saveFeePayStatus", saveFeeStatus);
router.get("/getStudents", getStudents);
router.put("/getFeeStatus", getFeeStatus);
router.put("/attendanceStatus", getAttendanceStatus);
router.delete("/deleteStudent/:id", deleteStudents);
router.put("/updateStudent/:id", updateStudent);
module.exports = router;
