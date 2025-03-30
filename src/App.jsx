import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import SignUp from "./Components/Authentication/SignUp";
import Navbar from "./Components/NavBar";
import SignIn from "./Components/Authentication/SignIn";
import Dashboard from "./Components/Dashboard/DashBoard";
import AttendanceForm from "./Components/Dashboard/AttendanceForm";
import StudentRegistrationForm from "./Components/Dashboard/StudentRegistration";
import GetStudentTable from "./Components/Dashboard/getStudentTable";
import FeeStatus from "./Components/Dashboard/feeStatus";
import AdminDashBoard from "./Components/Dashboard/adminDashboard";
import BatchCard from "./Components/Dashboard/adminBatchCard";

function Header() {
  const navigate = useNavigate();

  return localStorage.getItem("token") ? (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md p-4 fixed top-0 left-0 w-full z-50 text-blue-600 text-2xl font-bold flex items-center"
    >
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:text-blue-800 transition-all mr-4"
      >
        <ChevronLeft size={28} />
      </button>
      <span className="flex-grow text-center">Attendify</span>
    </motion.nav>
  ) : (
    <Navbar />
  );
}

function App() {
  return (
    <>
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
    </>
  );
}

export default App;
