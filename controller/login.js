const Teacher = require("../model/teacherModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(404).json({ message: "Please Create Account" });
    }

    if (!teacher.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email first" });
    }

    const isPasswordValid = await bcrypt.compare(password, teacher.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: teacher.id, email: teacher.email },
      process.env.secret_key, // Ensure this is defined in .env
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login Successful", token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = login;
