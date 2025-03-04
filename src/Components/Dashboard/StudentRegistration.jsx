import axios from "axios";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentRegistrationTable = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    joiningDate: "",
  });


  const [students, setStudents] = useState([]); // Store registered students

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.contact || !formData.joiningDate) {
      toast.error("All fields are required!");
      return;
    }
console.log("for",formData);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/studentRegistration",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Form data", formData);

      // Update the students list with response data
      setStudents([...students, response.data]);

      // Reset form fields
      setFormData({ name: "", contact: "", joiningDate: "" });

      // Show success message
      toast.success(`${response.data.name} registered successfully!`);
    } catch (error) {
      console.error(
        "Error:",
        error.response?.data || "No response from server"
      );

      toast.error(error.response?.data?.message || "Backend not connected", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <ToastContainer />
      <h2 className="text-2xl font-bold text-center mb-4">
        Student Registration
      </h2>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Contact No.:</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Joining Date:</label>
          <input
            type="date"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Add Student
        </button>
      </form>

    
    </div>
  );
};

export default StudentRegistrationTable;
