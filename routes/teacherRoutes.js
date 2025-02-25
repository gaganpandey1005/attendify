    const express = require("express");
    const router = express.Router();
    const {registerTeacher} = require("../controller/registration");

    router.post("/register", registerTeacher);

    module.exports = router;
