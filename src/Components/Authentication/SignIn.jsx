import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { isAdminRestricted } from "../../helper";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://attendify-backend-szi8.onrender.com/api/login",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success(response.data.message || "Logged in successfully!", {
        position: "top-center",
        autoClose: 3000,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      localStorage.setItem("userEmail", formData.email);

      if (
        formData.email === "admin@gmail.com" &&
        formData.password === "1234"
      ) {
        navigate("/admin");
        return;
      }
      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again later.";
      toast.error(errorMessage, { position: "top-center", autoClose: 3000 });
    }
    setLoading(false);
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

        <motion.button
          whileHover={!loading ? { scale: 1.05 } : {}}
          whileTap={!loading ? { scale: 0.95 } : {}}
          className="bg-blue-500 text-white p-2 rounded-lg mt-4 shadow-md hover:bg-blue-600 transition-all flex items-center justify-center"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Sign In"
          )}
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
