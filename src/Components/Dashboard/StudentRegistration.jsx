import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const StudentRegistrationTable = () => {
  const { batchName } = useParams(); // Get batch name from URL params
  const batch=batchName;
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    joiningDate: new Date().toISOString().split("T")[0], // Current date
    batchName:batch
  });
  
  

  const [students, setStudents] = useState([]); // Store registered students

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      batchName: batch, // Keep the batch name intact
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure fields are not empty
    if (!formData.name || !formData.contact) {
      toast.error("Name and contact are required!");
      return;
    }
    // Add batchName to formData before sending
    const studentData = { ...formData, batchName: batch };

    console.log("Sending Data:", formData); // Debugging
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `https://attendify-backend-szi8.onrender.com/api/studentRegistration`,
        formData,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Form data received:", response.data);

      // Update state
      setStudents([...students, response.data]);

      // Reset form fields
      setFormData({
        name: "",
        contact: "",
        joiningDate: new Date().toISOString().split("T")[0],
        batchName: batch,
      });

      toast.success(`${response.data.student.name} registered successfully!`);
    } catch (error) {
      console.error(
        "Error:",
        error.response?.data || "No response from server"
      );

      toast.error(error.response?.data?.message || "No response", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <ToastContainer />
      <h2 className="text-2xl font-bold text-center mb-4">
        Student Registration for Batch: {batchName}
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
