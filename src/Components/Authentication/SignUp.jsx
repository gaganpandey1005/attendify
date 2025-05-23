import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://attendify-backend-szi8.onrender.com/api/register",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 3000,
      });
      setFormData({ name: "", email: "", password: "" });
    } catch (error) {
      toast.error("Something went wrong", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center border-2 bg-white shadow-lg mx-6 lg:mx-40 lg:my-[15%] my-[30%] p-8 rounded-xl"
    >
      <ToastContainer />
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-semibold text-gray-700 mb-4"
      >
        Sign Up
      </motion.h1>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium">Name</label>
          <motion.input
            whileFocus={{ scale: 1.05 }}
            className="border p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 transition-all outline-none"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

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

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-500 text-white p-2 rounded-lg mt-4 shadow-md hover:bg-blue-600 transition-all flex items-center justify-center"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            "Sign Up"
          )}
        </motion.button>

        <div className="flex">
          <span>Already have an account?</span>
          <span
            onClick={() => navigate("/signin")}
            className="text-blue-600 ml-2 cursor-pointer"
          >
            Sign In
          </span>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default SignUp;
