import React, { useState } from "react";
import { motion } from "framer-motion";

const Navbar = () =>
{
    const [isOpen, setIsOpen] = useState(false);

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
                    MyApp
                </motion.div>

                {/* Desktop Menu */}
                <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="hidden md:flex space-x-6"
                >
                    {["Home", "About", "Sign Up"].map((item, index) => (
                        <motion.li
                            key={index}
                            whileHover={{ scale: 1.1 }}
                            className="text-gray-700 cursor-pointer hover:text-blue-500 transition-all"
                        >
                            {item}
                        </motion.li>
                    ))}
                </motion.ul>

                {/* Mobile Menu Button */}
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
                    {isOpen ? (
                        <span className="text-2xl">&times;</span> // Close icon (✖)
                    ) : (
                        <span className="text-2xl">&#9776;</span> // Menu icon (☰)
                    )}
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
                    {["Home", "About", "Sign Up"].map((item, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.1 }}
                            className="text-gray-700 cursor-pointer hover:text-blue-500 transition-all"
                            onClick={() => setIsOpen(false)}
                        >
                            {item}
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </nav>
    );
};

export default Navbar;
