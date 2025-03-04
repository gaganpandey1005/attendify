const express = require("express");
const studentRegistration = require("../controller/student");
const router = express.Router();

router.post("/studentRegistration", studentRegistration);

module.exports = router;
