const Teacher = require("../model/teacherModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

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
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create new teacher
    const newTeacher = new Teacher({
      email,
      password: hashedPassword,
      name,
      token: verificationToken,
      tokenExpiry: Date.now() + 3600000, // Token valid for 1 hour
    });

    // Save to database
    await newTeacher.save();

    // Send verification email (optional)
    await sendVerificationEmail(email, verificationToken);

    // Respond to client
    res.status(201).json({ message: "Teacher registered successfully" });
  } catch (error) {
    console.error("Error registering teacher:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Dummy function for email verification (Implement properly)
const sendVerificationEmail = async (email, token) => {
  const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
      user:process.env.EMAIL,
      pass:process.env.PASSWORD
    }
  })
  const mailOption= {
    from: process.env.EMAIL,
    to: email,
    subject:'Email Verification',
    text: `Click on the link to verify your email: http://localhost:5000/verify/${token}`,
  
  };
  
  const info=await transporter.sendMail(mailOption);
  console.log(`email send with ${info.response}`);
};



module.exports = { registerTeacher };
