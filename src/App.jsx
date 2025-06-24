import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
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
import PrivateRoute from "./Components/Authentication/PrivateRoute"; 
import { useAuth } from "./Context/AuthContext";
import { useLocation } from "react-router-dom";
function App() {
 const {login,setLogin}=useAuth();
 const location=useLocation()
 
 return (
   <>
     {login &&
       location.pathname !== "/signin" &&
       location.pathname !== "/signup" && <Header />}
     <Routes>
       <Route path="/" element={<SignUp />} />
       <Route path="/signup" element={<SignUp />} />
       <Route path="/signin" element={<SignIn />} />

       {/* ✅ Protected routes */}
       <Route
         path="/dashboard"
         element={
           <PrivateRoute>
             <Dashboard />
           </PrivateRoute>
         }
       />
       <Route
         path="/Attendance"
         element={
           <PrivateRoute>
             <AttendanceForm />
           </PrivateRoute>
         }
       />
       <Route
         path="/registerStudent/:batchName"
         element={
           <PrivateRoute>
             <StudentRegistrationForm />
           </PrivateRoute>
         }
       />
       <Route
         path="/getStudent"
         element={
           <PrivateRoute>
             <GetStudentTable />
           </PrivateRoute>
         }
       />
       <Route
         path="/feeStatus"
         element={
           <PrivateRoute>
             <FeeStatus />
           </PrivateRoute>
         }
       />
       <Route
         path="/admin"
         element={
           <PrivateRoute>
             <AdminDashBoard />
           </PrivateRoute>
         }
       />
       <Route
         path="/getTeacherBatches"
         element={
           <PrivateRoute>
             <BatchCard />
           </PrivateRoute>
         }
       />
     </Routes>
   </>
 );
}

export default App;
