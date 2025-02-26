import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BatchForm({ onClose }) {
  const [batch, setBatch] = useState(""); // Ensure it's initialized as an empty string
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ batch, date });

    // Show success notification
    toast.success("Batch Created Successfully!", { position: "top-center" });

    // Close the form after submission
    onClose();
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

        {/* Batch Name */}
        <div className="mb-3">
          <label className="block font-semibold">Batch Name</label>
          <input
            type="text"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
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
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}
