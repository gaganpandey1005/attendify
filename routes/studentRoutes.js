const express = require("express");
const {studentRegistration,getStudents, getFeeStatus, getAttendanceStatus, saveAttendance, saveFeeStatus} = require("../controller/student");
const router = express.Router();

router.post("/studentRegistration", studentRegistration);
router.post("/saveAttendance", saveAttendance);
router.post("/saveFeePayStatus", saveFeeStatus);
router.get("/getStudents",getStudents);
router.put("/getFeeStatus",getFeeStatus);
router.put("/attendanceStatus",getAttendanceStatus);

module.exports = router;
