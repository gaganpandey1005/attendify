import axios from "axios";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BatchForm({ onClose }) {
  const [formData, setFormData] = useState({
    batchName: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Get JWT token

    if (!token) {
      toast.error("User is not authenticated. Please log in again.", {
        position: "top-center",
      });
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/createBatch", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Send JWT in Authorization header
        },
      });

      toast.success("Batch Created Successfully!", { position: "top-center" });
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again later.";
      toast.error(errorMessage, { position: "top-center", autoClose: 3000 });
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96 relative">
        <h2 className="text-xl font-bold mb-4">Batch Details</h2>

        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          ✖
        </button>

        <form onSubmit={handleSubmit}>
          {/* Batch Name */}
          <div className="mb-3">
            <label className="block font-semibold">Batch Name</label>
            <input
              type="text"
              name="batchName"
              value={formData.batchName}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter Batch Name"
            />
          </div>

          {/* Date Input */}
          <div className="mb-3">
            <label className="block font-semibold">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
