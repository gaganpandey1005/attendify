const express = require("express");
const {studentRegistration,getStudents} = require("../controller/student");
const router = express.Router();

router.post("/studentRegistration", studentRegistration);
router.get("/getStudents",getStudents);

module.exports = router;
