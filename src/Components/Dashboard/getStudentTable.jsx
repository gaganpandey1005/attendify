import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import * as XLSX from "xlsx";

const GetStudentTable = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceDates, setAttendanceDates] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(""); // Selected month
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const batchName = queryParams.get("batchName") || "";

  useEffect(() => {
    const fetchStudents = async () => {
      if (!batchName) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `https://attendify-backend-szi8.onrender.com/api/getStudents?batchName=${batchName}`
        );
        setStudents(response.data.students || response.data);

        // Extract unique attendance dates and months
        const dates = new Set();
        const months = new Set();
        response.data.students.forEach((student) => {
          Object.keys(student.attendance || {}).forEach((date) => {
            dates.add(date);
            months.add(date.slice(0, 7)); // Extract YYYY-MM format
          });
        });

        setAttendanceDates(Array.from(dates).sort());
        setSelectedMonth(Array.from(months).sort()[0] || ""); // Set default month
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
  }, [batchName]);

  // Function to download Excel for the selected month
  const downloadExcel = () => {
    const monthlyData = {}; // Object to store data categorized by month

    students.forEach((student) => {
      Object.keys(student.attendance || {}).forEach((date) => {
        const month = date.slice(0, 7); // Extract YYYY-MM (e.g., "2025-03")
        if (!monthlyData[month]) monthlyData[month] = []; // Initialize month if not present

        let row = {
          Name: student.name,
          "Contact No.": student.contact,
          "Joining Date": new Date(student.joiningDate).toLocaleDateString(),
          "Fee Pay Date": student.feePayDate
            ? new Date(student.feePayDate).toLocaleDateString()
            : "Not Paid",
        };

        // Add attendance status for the specific month
        attendanceDates
          .filter((d) => d.startsWith(month)) // Only dates for that month
          .forEach((d) => {
            row[d] = student.attendance?.[d] ? "Present" : "Absent";
          });

        monthlyData[month].push(row);
      });
    });

    const workbook = XLSX.utils.book_new(); // Create a new Excel workbook

    // Add each month's data as a separate sheet
    Object.keys(monthlyData).forEach((month) => {
      const worksheet = XLSX.utils.json_to_sheet(monthlyData[month]);
      XLSX.utils.book_append_sheet(workbook, worksheet, month); // Month as sheet name
    });

    XLSX.writeFile(workbook, `Students_${batchName}.xlsx`); // Save and download
  };

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

          {/* Dropdown for selecting month */}
          <div className="mb-4">
            <label className="mr-2 font-semibold">Select Month:</label>
            <select
              className="border px-2 py-1 rounded"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {Array.from(
                new Set(attendanceDates.map((date) => date.slice(0, 7)))
              )
                .sort()
                .map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
            </select>
          </div>

          {/* Button to download the Excel file */}
          <button
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={downloadExcel}
          >
            Download Excel for {selectedMonth}
          </button>

          {/* Table displaying students */}
          <div className="overflow-x-auto flex justify-center">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-center">
                  <th className="border-b p-2">Name</th>
                  <th className="border-b p-2">Contact No.</th>
                  <th className="border-b p-2">Joining Date</th>
                  <th className="border-b p-2">Fee Pay Date</th>
                  {attendanceDates
                    .filter((date) => date.startsWith(selectedMonth))
                    .map((date) => (
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
                    <td className="p-2">
                      {new Date(student.joiningDate).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      {student.feePayStatus
                        ? new Date(student.feePayDate).toLocaleDateString()
                        : "Not Paid"}
                    </td>
                    {attendanceDates
                      .filter((date) => date.startsWith(selectedMonth))
                      .map((date) => (
                        <td key={date} className="p-2">
                          {student.attendance?.[date] ? "Present" : "Absent"}
                        </td>
                      ))}
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
