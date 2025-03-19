import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PlusCircle } from "lucide-react";

const AttendanceStatus = () => {
  const navigate=useNavigate();
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
          `http://localhost:5000/api/getStudents?batchName=${batchName}`
        );

        const studentsData = response.data.students.map((student) => ({
          ...student,
          attendance: student.attendance || {},
        }));

        const allDates = new Set();
        studentsData.forEach((student) => {
          Object.keys(student.attendance).forEach((date) => allDates.add(date));
        });
        allDates.add(getCurrentDate());

        setStudents(studentsData);
        setDates([...allDates].sort());
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
        "http://localhost:5000/api/attendanceStatus",
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

  const saveAttendance = async () => {
    try {
      await axios.post("http://localhost:5000/api/saveAttendance", {
        students,
      });
      toast.success("Attendance saved successfully!");
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.error("Failed to save attendance.");
    }
  };

  // const addStudent = () => {
  //   try{

  //   }
  // };

  return (
    <div className="p-4 md:p-6 mt-15 text-center">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold">
          Attendance Status for {batchName}
        </h2>
        <button
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          onClick={()=>{navigate(`/registerStudent/${batchName}`)}}
        >
          <PlusCircle className="w-6 h-6" />
          Add Student
        </button>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />

      {loading ? (
        <p className="text-gray-600">Loading attendance status...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse border border-gray-300 shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="border-b p-2">Name</th>
                <th className="border-b p-2">Contact No.</th>
                {dates.map((date) => (
                  <th key={date} className="border-b p-2">
                    {date}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="text-center border-b">
                  <td className="p-2">{student.name}</td>
                  <td className="p-2">{student.contact}</td>
                  {dates.map((date) => (
                    <td key={date} className="p-2">
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
          <button
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-800"
            onClick={saveAttendance}
          >
            Save Attendance
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceStatus;
