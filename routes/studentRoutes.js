const express = require("express");
const {studentRegistration,getStudents, getFeeStatus} = require("../controller/student");
const router = express.Router();

router.post("/studentRegistration", studentRegistration);
router.get("/getStudents",getStudents);
router.put("/getFeeStatus",getFeeStatus);

module.exports = router;
