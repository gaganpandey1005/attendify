import React from "react";
import { motion } from "framer-motion";
import Avatar, { genConfig } from "react-nice-avatar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TeacherNameCards = ({ teachers }) => {
  const navigate = useNavigate();

  const handleClick = async (email) => {
    try {
      
      const res = await axios.get(
        `http://localhost:5000/api/getTeacherBatches/${email}`
      );
      
      

      
      navigate("/getTeacherBatches",{state:{email}});
      
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  return (
    <div className="flex bg-gray-100 justify-start">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {teachers.map((teacher, index) => {
          const config = genConfig({ seed: teacher.email }); // Generates consistent avatar for the teacher
          return (
            <motion.div
              key={index}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative shadow-lg rounded-3xl p-3 transform h-50 transition-transform duration-300 hover:shadow-xl overflow-visible cursor-pointer"
              onClick={() => handleClick(teacher.email)} // Click event sends email in the body
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  whileTap={{ y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <Avatar className="w-32 h-32" {...config} />
                </motion.div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  {teacher.name}
                </h2>
                <p className="text-gray-500">{teacher.email}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherNameCards;
