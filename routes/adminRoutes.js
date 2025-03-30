const express = require("express");
const {
  getAllDetails,
  getTeacherBatches,
} = require("../controller/allDetailsController");

const router = express.Router();

router.get("/getAllDetails", getAllDetails);
router.get("/getTeacherBatches/:email", getTeacherBatches);

module.exports = router;
