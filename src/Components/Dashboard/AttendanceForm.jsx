import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AttendanceStatus = () => {
  const [students, setStudents] = useState([]);
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Extract batchName from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const batchName = queryParams.get("batchName") || "";

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchAttendanceStatus = async () => {
      if (!batchName) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `https://attendify-backend-szi8.onrender.com/api/getStudents?batchName=${batchName}`
        );

        const studentsData = response.data.students.map((student) => ({
          ...student,
          attendance: student.attendance || {}, // Ensure attendance is an object
        }));

        // Extract all unique dates from attendance records
        const allDates = new Set();
        studentsData.forEach((student) => {
          Object.keys(student.attendance).forEach((date) => allDates.add(date));
        });

        // Ensure the current date is included
        allDates.add(getCurrentDate());

        setStudents(studentsData);
        setDates([...allDates].sort()); // Sort dates chronologically
      } catch (error) {
        console.error("Error fetching attendance status:", error);
        setError(
          error.response?.data?.message || "Failed to fetch attendance status."
        );
        toast.error("Failed to fetch attendance status.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceStatus();
  }, [batchName]);

  const updateAttendanceStatus = async (studentId, date) => {
    try {
      const response = await axios.put(
        "https://attendify-backend-szi8.onrender.com/api/attendanceStatus",
        { studentId, date }
      );

      if (response.status === 201) {
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === studentId
              ? {
                  ...student,
                  attendance: {
                    ...student.attendance,
                    [date]: response.data.attendStatus,
                  },
                }
              : student
          )
        );
      }
    } catch (error) {
      console.error("Error updating attendance status:", error);
      toast.error("Failed to update attendance status.");
    }
  };

  return (
    <div className="p-4 md:p-6 mt-10 text-center">
      <h2 className="text-xl md:text-2xl font-bold mb-4">
        Attendance Status for {batchName}
      </h2>
      <ToastContainer position="top-right" autoClose={3000} />

      {loading ? (
        <p className="text-gray-600">Loading attendance status...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : students.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse border border-gray-300 shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="border-b p-3 whitespace-nowrap">Name</th>
                <th className="border-b p-3 whitespace-nowrap">Contact No.</th>
                {dates.map((date) => (
                  <th key={date} className="border-b p-3 whitespace-nowrap">
                    {date}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="text-center border-b">
                  <td className="p-3">{student.name}</td>
                  <td className="p-3">{student.contact}</td>
                  {dates.map((date) => (
                    <td key={date} className="p-3">
                      <span
                        className={`font-bold ${
                          student.attendance[date]
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {student.attendance[date] ? "Present" : "Absent"}
                      </span>
                      {date === getCurrentDate() && (
                        <button
                          className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-700 text-sm"
                          onClick={() =>
                            updateAttendanceStatus(student._id, date)
                          }
                        >
                          Update
                        </button>
                      )}
                    </td>
                  ))}
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

export default AttendanceStatus;
