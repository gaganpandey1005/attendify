const express = require("express");
const {studentRegistration,getStudents, getFeeStatus, getAttendanceStatus, saveAttendance} = require("../controller/student");
const router = express.Router();

router.post("/studentRegistration", studentRegistration);
router.post("/saveAttendance", saveAttendance);
router.get("/getStudents",getStudents);
router.put("/getFeeStatus",getFeeStatus);
router.put("/attendanceStatus",getAttendanceStatus);

module.exports = router;
