const Batch = require("../model/batchModel");
const Student = require("../model/studentModel");
const Teacher = require("../model/teacherModel");

const getAllDetails = async (req, res) => {
  try {
    

    const batches = await Batch.find();
    
    
    const teachers = await Teacher.find();
    const students = await Student.find();

    return res.status(200).json({ batches, teachers, students });
  } catch (err) {
    console.error("Error fetching data:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

 const getTeacherBatches = async (req, res) => {
   const { email } = req.params;
console.log(email);

   try {
     // Find teacher by email
     const teacher = await Teacher.findOne({ email });
     if (!teacher) {
       return res.status(400).json({ message: "Teacher not found" });
     }

     // Find batches assigned to the teacher
     const batches = await Batch.find({ teacher: teacher._id });

     
     return res.status(200).json({ batches });
   } catch (err) {
     console.error("Error:", err);
     return res.status(500).json({ message: "Something went wrong" });
   }
 };



module.exports = {getAllDetails, getTeacherBatches};
