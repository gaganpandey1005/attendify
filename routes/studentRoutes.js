const express = require("express");
const {studentRegistration,getStudents, getFeeStatus, getAttendanceStatus} = require("../controller/student");
const router = express.Router();

router.post("/studentRegistration", studentRegistration);
router.get("/getStudents",getStudents);
router.put("/getFeeStatus",getFeeStatus);
router.put("/attendanceStatus",getAttendanceStatus);

module.exports = router;
