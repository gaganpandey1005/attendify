import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { IoMdLogOut } from "react-icons/io";
import { useAuth } from "../Context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { login, setLogin } = useAuth();
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="background shadow-md p-4 fixed top-0 left-0 w-full h- z-50 text-blue-600 text-2xl font-bold flex items-center"
    >
      <button
        onClick={() => {
          navigate(-1);
          localStorage.clear("token");
        }}
        className="text-blue-600 hover:text-blue-800 transition-all mr-4"
      >
        <ChevronLeft size={28} />
      </button>
      <span className="flex-grow text-center">Attendify</span>
      <div className="relative group">
        <button
          className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg p-2 transition-all duration-200"
          onClick={() => {
            navigate(-1);
          }}
        >
          <LogOut
            className="w-5 h-5"
            onClick={() => {
              localStorage.clear("token");
              sessionStorage.clear("token");
              setLogin(false);
            }}
          />
        </button>
        <div className="absolute  transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100  duration-200 whitespace-nowrap">
          Sign Out
        </div>
      </div>
    </motion.nav>
  );
}
