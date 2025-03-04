const Student = require("../model/studentModel"); // Ensure correct model import

const studentRegistration = async (req, res) => {
  
    // Debugging: Log the received request body
    console.log("Received Request Body:", req.body);

    const { name, joiningDate, contactNo } = req.body;

    // Check if all fields are provided
    if (!name || !joiningDate || !contactNo) {
      return res.status(400).json({ message: "All information required" });
    }

    // Check if student already exists based on contact number
    const existingStudent = await Student.findOne({ contactNo });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }

    // Create a new student instance
    const newStudent = new Student({
      name,
      joiningDate,
      contactNo,
    });

    // Save the new student
    await newStudent.save();

    // Return success response
    res.status(201).json({
      message: "Student registered successfully",
      student: newStudent,
    });
  
};

module.exports = studentRegistration;
