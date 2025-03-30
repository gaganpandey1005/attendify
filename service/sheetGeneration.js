const fs = require("fs");
const XLSX = require("xlsx");
const path = require("path");

const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const generateAttendanceExcel = (students, batchName) => {

  
  return new Promise((resolve, reject) => {
    try {
      const date = new Date();
      const month = date.getMonth() + 1;

      const publicDir = path.join(__dirname, "public");
      ensureDirectoryExists(publicDir);

      const excelPath = path.join(publicDir, `${batchName} ${month}.xlsx`);


      // **Step 1: Collect all unique dates**
      let uniqueDates = new Set();
      students.forEach((student) => {
        if (student.attendance) {
          Object.keys(student.attendance).forEach((date) =>
            uniqueDates.add(date)
          );
        }
      });

      uniqueDates = Array.from(uniqueDates).sort();

      // **Step 2: Create Header Row**
      const headers = [
        "Student Name",
        "Contact",
        "Joining Date",
        "Fee Paid",
        ...uniqueDates,
      ];

      // **Step 3: Create Data Rows**
      const dataRows = students.map((student) => [
        student.name || "N/A",
        student.contact || "N/A",
        student.joiningDate
          ? new Date(student.joiningDate).toLocaleDateString()
          : "N/A",
        student.feePayStatus ? "Paid" : "Unpaid",
        ...uniqueDates.map((date) => (student.attendance?.[date] ? "P" : "A")),
      ]);

      // **Step 4: Create Excel Sheet**
      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

      // **Step 5: Write to File**
      XLSX.writeFile(workbook, excelPath);

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateAttendanceExcel;
