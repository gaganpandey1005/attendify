import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PlusCircle } from "lucide-react";
import { isAdminRestricted } from "../../helper";

const AttendanceStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({ name: "", contact: "" });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const batchName = queryParams.get("batchName") || "";
  const batchId = location.state || null;
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
      if (isAdminRestricted()) return;
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

  const saveAttendance = async () => {
    if (isAdminRestricted()) return;
    try {
      await axios.post(
        "https://attendify-backend-szi8.onrender.com/api/saveAttendance",
        {
          students,
        }
      );
      toast.success("Attendance saved successfully!");
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.error("Failed to save attendance.");
    }
  };

  const handleDelete = async (studentId, batchName) => {
    console.log("delete", studentId);

    if (isAdminRestricted()) return;
    try {
      console.log("check", studentId);

      await axios.delete(
        `http://localhost:5000/api/deleteStudent/${studentId}`,
        {
          data: { batchName },
        }
      );
      toast.success("Student Deleted");
    } catch (err) {
      console.error("Error deleting student:", err);
      console.log(err);

      toast.error("Failed to delete student.");
    }
  };

  // Handle opening the edit modal
  const handleEdit = (studentId) => {
    if (isAdminRestricted()) return;

    const student = students.find((s) => s._id === studentId);
    if (student) {
      setEditingStudent(studentId);
      setFormData({
        name: student.name,
        contact: student.contact,
      });
      setIsEditModalOpen(true);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (isAdminRestricted()) return;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/updateStudent/${editingStudent}`,
        {
          name: formData.name,
          contact: formData.contact,
          batchName,
        }
      );

      if (response.status === 200) {
        // Update the student in the local state
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === editingStudent
              ? { ...student, name: formData.name, contact: formData.contact }
              : student
          )
        );

        toast.success("Student details updated successfully!");
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error("Failed to update student details.");
    }
  };

  // Close the modal
  const closeModal = () => {
    setIsEditModalOpen(false);
    setEditingStudent(null);
  };

  return (
    <div className="p-4 md:p-8 mt-16 text-center">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
          Attendance Status for{" "}
          <span className="text-blue-600">{batchName}</span>
        </h2>
        <button
          className="flex items-center gap-2 bg-blue-100 text-blue-600 px-3 py-1.5 rounded hover:bg-blue-200 transition"
          onClick={() => navigate(`/registerStudent/${batchName}`)}
        >
          <PlusCircle className="w-5 h-5" />
          <span className="font-medium">Add Student</span>
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />

      {loading ? (
        <p className="text-gray-500 text-lg">Loading attendance status...</p>
      ) : error ? (
        <p className="text-red-600 text-lg">{error}</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-300">
          <table className="w-full text-sm text-center bg-white">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Contact No.</th>
                {dates.map((date) => (
                  <th key={date} className="p-3 border-b whitespace-nowrap">
                    {date}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{student.name}</td>
                  <td className="p-3">{student.contact}</td>
                  {dates.map((date) => (
                    <td key={date} className="p-3">
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            student.attendance[date]
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {student.attendance[date] ? "Present" : "Absent"}
                        </span>

                        {date === getCurrentDate() && (
                          <div className="flex gap-2 mt-1">
                            <button
                              className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition"
                              onClick={() =>
                                updateAttendanceStatus(student._id, date)
                              }
                            >
                              Update
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(student._id, batchId);
                              }}
                              className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => {
                                handleEdit(student._id);
                              }}
                              className="bg-orange-500 text-white px-2 py-1 rounded text-xs hover:bg-orange-600 transition"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mt-6">
            <button
              className="bg-green-600 text-white px-6 py-2 rounded font-medium hover:bg-green-700 transition"
              onClick={saveAttendance}
            >
              Save Attendance
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Student Details</h3>

            <form onSubmit={handleSubmitEdit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 text-left mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="contact"
                  className="block text-sm font-medium text-gray-700 text-left mb-1"
                >
                  Contact Number
                </label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceStatus;
