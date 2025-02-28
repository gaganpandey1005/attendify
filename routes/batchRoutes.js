const express= require("express")
const router = express.Router();
const { createBatch, getBatches } = require("../controller/batch");
router.post("/createBatch", createBatch);


router.get("/getBatch", getBatches);

module.exports = router;
