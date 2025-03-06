import React, { useEffect } from "react";
import SignUp from "./Components/Authentication/SignUp";
import Navbar from "./Components/NavBar";
import SignIn from "./Components/Authentication/SignIn";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Dashboard from "./Components/Dashboard/DashBoard";
import AttendanceForm from "./Components/Dashboard/AttendanceForm";
import StudentRegistrationForm from "./Components/Dashboard/StudentRegistration";
import GetStudentTable from "./Components/Dashboard/getStudentTable";
import FeeStatus from "./Components/Dashboard/feeStatus";



function App() {
 

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Attendance" element={<AttendanceForm />} />
        <Route path="/registerStudent" element={<StudentRegistrationForm />} />
        <Route path="/getStudent" element={<GetStudentTable />} />
        <Route path="/feeStatus" element={<FeeStatus/>}/>

        {/* <CreateSheet/> */}
      </Routes>
    </>
  );
}

export default App;
