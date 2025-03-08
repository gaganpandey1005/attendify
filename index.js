const express = require("express");
const app = express();
const connectDb = require("./config/db.js");
const teacherRoutes = require("./routes/teacherRoutes");
const batchRoutes=require("./routes/batchRoutes.js")
const studentRoutes=require("./routes/studentRoutes.js")
const cors= require("cors")
app.use(cors())
require("dotenv").config();

connectDb();
    
app.use(express.json());
app.use("/api", teacherRoutes);
app.use("/api", batchRoutes);
app.use("/api", studentRoutes);

app.listen(process.env.PORT, console.log("Server running on port 5000"));
