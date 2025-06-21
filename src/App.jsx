import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import SignUp from "./Components/Authentication/SignUp";

import SignIn from "./Components/Authentication/SignIn";
import Dashboard from "./Components/Dashboard/DashBoard";
import AttendanceForm from "./Components/Attendance/AttendanceForm";
import StudentRegistrationForm from "./Components/Attendance/StudentRegistration";
import GetStudentTable from "./Components/Dashboard/getStudentTable";
import FeeStatus from "./Components/Dashboard/feeStatus";
import AdminDashBoard from "./Components/Admin/adminDashboard";
import BatchCard from "./Components/Admin/adminBatchCard";
import Header from "./Components/Header";

function App() {
  return (
    <>
      <div className="background">
        <Header />
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Attendance" element={<AttendanceForm />} />
          <Route
            path="/registerStudent/:batchName"
            element={<StudentRegistrationForm />}
          />
          <Route path="/getStudent" element={<GetStudentTable />} />
          <Route path="/feeStatus" element={<FeeStatus />} />
          <Route path="/admin" element={<AdminDashBoard />} />
          <Route path="/getTeacherBatches" element={<BatchCard />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
