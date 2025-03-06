import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const FeeStatus = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();

  // Extract batchName from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const batchName = queryParams.get("batchName") || "";
  console.log(batchName);
  

  useEffect(() => {
    const fetchFeeStatus = async () => {
      if (!batchName) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/getStudents?batchName=${batchName}`
        );
        setStudents(response.data.students || []);
      } catch (error) {
        console.error("Error fetching fee status:", error);
        setError(
          error.response?.data?.message || "Failed to fetch fee status."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeeStatus();
  }, [batchName]);

  // Function to toggle fee status
  const toggleFeeStatus = async (studentId, currentStatus) => {
    try {
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === studentId
            ? { ...student, paid: !currentStatus }
            : student
        )
      );
      // Send update request to backend
      
      // Update state to reflect changes
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === studentId
            ? { ...student, paid: !currentStatus }
            : student
        )
      );
    } catch (error) {
      console.error("Error updating fee status:", error);
      alert("Failed to update fee status.");
    }
  };

  return (
    <div className="p-6 mt-10 text-center">
      <h2 className="text-2xl font-bold mb-6">Fee Status for {batchName}</h2>

      {loading ? (
        <p className="text-gray-600">Loading fee status...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : students.length > 0 ? (
        <div className="overflow-x-auto flex justify-center">
          <table className="w-full max-w-5xl border-collapse border border-gray-300 shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="border-b p-3">Name</th>
                <th className="border-b p-3">Contact No.</th>
                <th className="border-b p-3">Fee Status</th>
                <th className="border-b p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="text-center border-b">
                  <td className="p-3">{student.name}</td>
                  <td className="p-3">{student.contact}</td>
                  <td
                    className={`p-3 font-bold ${
                      student.paid ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {student.paid ? "Paid" : "Unpaid"}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleFeeStatus(student._id, student.paid)}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 mt-1 rounded-lg text-white transition-all ${
                        student.paid
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      } text-sm sm:text-base md:text-lg`}
                    >
                      {student.paid ? "Mark Unpaid" : "Mark Paid"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No students registered in this batch.</p>
      )}
    </div>
  );
};

export default FeeStatus;
