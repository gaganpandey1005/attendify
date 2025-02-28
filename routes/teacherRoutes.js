const express = require("express");
const router = express.Router();
const { registerTeacher } = require("../controller/registration");

const login = require("../controller/login");
const verifyEmail = require("../controller/verifyEmail");

router.post("/register", registerTeacher);
router.post("/login", login);
    
router.get("/verification/:token", verifyEmail);

module.exports = router;
