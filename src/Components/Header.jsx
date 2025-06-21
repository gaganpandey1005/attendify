import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();

  return localStorage.getItem("token") ? (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="background shadow-md p-4 fixed top-0 left-0 w-full h- z-50 text-blue-600 text-2xl font-bold flex items-center"
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
