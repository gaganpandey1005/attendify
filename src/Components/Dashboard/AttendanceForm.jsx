import { useState } from "react";

export default function AttendanceForm() {
  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const addStudent = () => {
    if (studentName.trim() !== "") {
      setStudents([...students, { name: studentName, attendance: {} }]);
      setStudentName("");
    }
  };

  const handleAttendanceChange = (studentIndex, status) => {
    const updatedStudents = [...students];
    updatedStudents[studentIndex].attendance[selectedDate] = status;
    setStudents(updatedStudents);
  };

  const submitAttendance = () => {
    console.log("Attendance Submitted:", students);
    alert("Attendance submitted successfully!");
  };

  return (
    <div className="p-4 mt-20 bg-white rounded-lg shadow-lg max-w-4xl mx-auto overflow-auto">
      <h2 className="text-xl font-bold mb-2">Take Attendance</h2>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Enter student name"
          className="border p-2 flex-1 rounded"
        />
        <input
          type="text"
          value={contactNo}
          onChange={(e) => setContactNo(e.target.value)}
          placeholder="Contact Number"
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={addStudent}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Student
        </button>
      </div>
      <div className="mb-4">
        <label className="font-bold">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded ml-2"
        />
      </div>
      {students.length > 0 && (
        <div className="overflow-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border p-2">S. No</th>
                <th className="border p-2">Student Name</th>
                <th className="border p-2">Attendance ({selectedDate})</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, studentIndex) => (
                <tr key={studentIndex}>
                  <td className="border p-2">{studentIndex + 1}</td>
                  <td className="border p-2">{student.name}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleAttendanceChange(studentIndex, "P")}
                      className={`px-3 py-1 rounded ${
                        student.attendance[selectedDate] === "P"
                          ? "bg-green-500 text-white"
                          : "bg-gray-300"
                      }`}
                    >
                      P
                    </button>
                    <button
                      onClick={() => handleAttendanceChange(studentIndex, "A")}
                      className={`ml-2 px-3 py-1 rounded ${
                        student.attendance[selectedDate] === "A"
                          ? "bg-red-500 text-white"
                          : "bg-gray-300"
                      }`}
                    >
                      A
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {students.length > 0 && (
        <button
          onClick={submitAttendance}
          className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit Attendance
        </button>
      )}
    </div>
  );
}
