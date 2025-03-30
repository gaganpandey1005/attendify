import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Key } from "lucide-react";

const FeeStatus = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const batchName = queryParams.get("batchName") || "";

  useEffect(() => {
    const fetchFeeStatus = async () => {
      if (!batchName) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `https://attendify-backend-szi8.onrender.com/api/getStudents?batchName=${batchName}`
        );
        setStudents(response.data.students || []);
      } catch (error) {
        console.error("Error fetching fee status:", error);
        setError(
          error.response?.data?.message || "Failed to fetch fee status."
        );
        toast.error("Failed to fetch fee status.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeeStatus();
  }, [batchName]);

  const updateFeeStatus = async (studentId) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/getFeeStatus",
        {
          studentId,
        }
      );

      if (response.status === 201) {
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === studentId
              ? { ...student, feePayStatus: response.data.feePayStatus }
              : student
          )
        );

        toast.success("Fee status updated successfully!");
      }
    } catch (error) {
      console.error("Error updating fee status:", error);
      toast.error("Failed to update fee status.");
    }
  };

  const saveFeeStatus = async () => {
    try {
      const date=new Date();
      
      await axios.post(
        "https://attendify-backend-szi8.onrender.com/api/saveFeePayStatus",
        {
          students: students.map((student) => ({
            _id: student._id,
            feePayStatus: student.feePayStatus,
            feePayDate: date, // Ensure date is sent
          })),
        }
      );
      console.log(students);
      
      toast.success("Fee status saved successfully!");
    } catch (error) {
      console.error("Error saving fee status:", error);
      toast.error("Failed to save fee status.");
    }
  };


  return (
    <div className="p-4 sm:p-6 mt-12 text-center">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Fee Status for {batchName}
      </h2>
      <ToastContainer position="top-right" autoClose={3000} />
      {loading ? (
        <p className="text-gray-600">Loading fee status...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : students.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="border-b p-2 sm:p-3">Name</th>
                <th className="border-b p-2 sm:p-3">Contact No.</th>
                <th className="border-b p-2 sm:p-3">Fee Status</th>
                <th className="border-b p-2 sm:p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="text-center border-b">
                  <td className="p-2 sm:p-3">{student.name}</td>
                  <td className="p-2 sm:p-3">{student.contact}</td>
                  <td
                    className={`p-2 sm:p-3 font-bold ${
                      student.feePayStatus ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {student.feePayStatus ? "Paid" : "Unpaid"}
                  </td>
                  <td className="p-2 sm:p-3">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-blue-700 text-xs sm:text-sm"
                      onClick={() => updateFeeStatus(student._id)}
                    >
                      Update Fee Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
            onClick={saveFeeStatus}
          >
            Save Fee Status
          </button>
        </div>
      ) : (
        <p className="text-gray-600">No students registered in this batch.</p>
      )}
    </div>
  );
};

export default FeeStatus;
