import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const GetStudentTable = () => {
  const [students, setStudents] = useState([]); // State to store students
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const location = useLocation();

  // Extract batchName from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const batchName = queryParams.get("batchName") || "";

  useEffect(() => {
    const fetchStudents = async () => {
      if (!batchName) return; // Don't fetch if batchName is empty
      setLoading(true);
      try {
        const response = await axios.get(
          `https://attendify-backend-szi8.onrender.com/api/getStudents?batchName=${batchName}`
        );
        setStudents(response.data.students || response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching students:", error);
        setError(
          error.response?.data?.message || "Failed to fetch student data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [batchName]); // Fetch data when batchName changes

  return (
    <div className="p-4 mt-10 text-center">
      <h2 className="text-2xl font-bold mb-4">Students in {batchName}</h2>

      {loading ? (
        <p className="text-gray-600 text-center mt-4">Loading students...</p>
      ) : error ? (
        <p className="text-red-600 text-center mt-4">{error}</p>
      ) : students.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-3">Registered Students</h3>
          <div className="overflow-x-auto flex justify-center">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-center">
                  <th className="border-b p-2">Name</th>

                  <th className="border-b p-2">Contact No.</th>
                  <th className="border-b p-2">Joining Date</th>

                  <th className="border-b p-2">Fee Pay Date</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id} className="text-center border-b">
                    <td className="p-2">{student.name}</td>

                    <td className="p-2">{student.contact}</td>
                    <td className="p-2">
                      {new Date(student.joiningDate).toLocaleDateString()}
                    </td>

                    <td className="p-2">
                      {student.feePayDate
                        ? new Date(student.feePayDate).toLocaleDateString()
                        : "Not Paid"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-center mt-4">
          No students registered yet.
        </p>
      )}
    </div>
  );
};

export default GetStudentTable;
