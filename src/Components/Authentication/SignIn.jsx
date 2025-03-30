import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // Import react-toastify
import { isAdminRestricted } from "../../helper";

const SignIn = () => {

  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear errors on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(
        "https://attendify-backend-szi8.onrender.com/api/login",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Handle response dynamically based on backend response
      toast.success(response.data.message || "Logged in successfully!", {
        position: "top-center",
        autoClose: 3000,
      });

      // Store token (if authentication is token-based)
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      localStorage.setItem("userEmail",formData.email);
      
      if (
        formData.email === "admin@gmail.com" &&
        formData.password === "1234"
      ) {
        navigate("/admin");
        localStorage.setItem("userEmail", formData.email);

        return;
      }
      // Redirect after successful login
      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again later.";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center border-2 bg-white shadow-lg mx-6 lg:mx-40 lg:my-[15%] my-[30%] p-8 rounded-xl"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-semibold text-gray-700 mb-4"
      >
        Sign In
      </motion.h1>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium">E-mail</label>
          <motion.input
            whileFocus={{ scale: 1.05 }}
            className="border p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 transition-all outline-none"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 font-medium">Password</label>
          <motion.input
            whileFocus={{ scale: 1.05 }}
            className="border p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 transition-all outline-none"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        {errors.general && (
          <p className="text-red-500 text-sm">{errors.general}</p>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-500 text-white p-2 rounded-lg mt-4 shadow-md hover:bg-blue-600 transition-all"
          type="submit"
        >
          Sign In
        </motion.button>

        <div className="flex">
          <span>Don't have an account?</span>
          <span
            onClick={() => navigate("/signup")}
            className="cursor-pointer text-blue-600 ml-5"
          >
            Sign Up
          </span>
        </div>
      </motion.form>
      <ToastContainer />
    </motion.div>
  );
};

export default SignIn;
