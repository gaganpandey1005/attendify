const Teacher = require("../model/teacherModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const verifyEmail = require("./verifyEmail");

const registerTeacher = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Password must be exactly 4 characters
    if (password.length !== 4) {
      return res
        .status(400)
        .json({ message: "Password should be exactly 4 characters" });
    }

    // Check if the teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const token = crypto.randomBytes(32).toString("hex");

    // Create new teacher
    const newTeacher = new Teacher({
      email,
      password: hashedPassword,
      name,
      token, // Renamed field for consistency
      tokenExpiry: Date.now() + 3600000, // Token valid for 1 hour
    });

    // Send verification email
    await sendVerificationEmail(email, token);

    //verify email
    // await verifyEmail()
    // Save to database
    await newTeacher.save();


    // Respond to client
    res.status(201).json({
      message:
        "Teacher registered successfully. Please check your email for verification.",
    });
  } catch (error) {
    console.error("Error registering teacher:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to send verification email
const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD, // Use App Password instead of real password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Email Verification",
      text: `Click on the link to verify your email: https://attendify-backend-szi8.onrender.com/api/verification/${token}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

module.exports = { registerTeacher };
