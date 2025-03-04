import React, { useEffect } from "react";
import SignUp from "./Components/Authentication/SignUp";
import Navbar from "./Components/NavBar";
import SignIn from "./Components/Authentication/SignIn";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Dashboard from "./Components/Dashboard/DashBoard";
import AttendanceForm from "./Components/Dashboard/AttendanceForm";
import StudentRegistrationForm from "./Components/Dashboard/StudentRegistration";



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

        {/* <CreateSheet/> */}
      </Routes>
    </>
  );
}

export default App;
