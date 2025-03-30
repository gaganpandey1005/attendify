const express = require("express");
const app = express();
const connectDb = require("./config/db.js");
const teacherRoutes = require("./routes/teacherRoutes");
const batchRoutes = require("./routes/batchRoutes.js");
const studentRoutes = require("./routes/studentRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const cors = require("cors");
require("dotenv").config();
require("./service/cronService.js"); // Importing the cron job without assigning it

// Connect to database
connectDb();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", teacherRoutes);
app.use("/api", batchRoutes);
app.use("/api", studentRoutes);
app.use("/api", adminRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
