import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { IoMdHome } from "react-icons/io";
import { FaInfoCircle } from "react-icons/fa";  // About icon
import { MdPersonAdd } from "react-icons/md";   // Sign Up icon


const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Define menu items properly
  const menuItems = [
    { name: "Home", icon: <IoMdHome />, path: "/" },
    { name: "About", icon:<FaInfoCircle/>, path: "/about" },
    { name: "Sign Up",icon:<MdPersonAdd/>, path: "/signup" },
  ];

  return (
    <nav className="bg-white shadow-md p-4 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl font-bold text-blue-600"
        >
          AttendiFy
        </motion.div>

        {/* Desktop Menu */}
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden md:flex space-x-6"
        >
          {menuItems.map((item, index) => (
            <motion.li
              key={index}
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-blue-500 transition-all"
              onClick={() => navigate(item.path)}
            >
              {item.icon && item.icon} {item.name}
            </motion.li>
          ))}
        </motion.ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-2xl"
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden flex flex-col items-center space-y-4 mt-4 bg-white py-4 shadow-md"
        >
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-blue-500 transition-all"
              onClick={() => {
                setIsOpen(false);
                navigate(item.path);
              }}
            >
              {item.icon && item.icon} 
            </motion.div>
          ))}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
