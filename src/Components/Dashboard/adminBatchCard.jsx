import React, { useState, useEffect } from "react";
import { FcCalendar } from "react-icons/fc";
import { IoMdAdd } from "react-icons/io";
import { PiStudent } from "react-icons/pi";

import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const BatchCard = () => {
  const location=useLocation()
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const email = location.state?.email; // Ensure email is retrieved correctly

  useEffect(() => {
    const fetchBatches = async () => {
      if (!email) {
        toast.error("User email not found!");
        setLoading(false);
        return;
      }
const token=localStorage.getItem("token");

      try {
        const res = await axios.get(
          `https://attendify-backend-szi8.onrender.com/api/getTeacherBatches/${email}`
        );
        setBatches(res.data.batches);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch batches");
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, [email]); // Added email as a dependency

  return (
    <div className="min-h-screen bg-gray-100 mt-15.5">
      {loading ? (
        <p className="text-center mt-4 text-lg font-semibold">Loading...</p>
      ) : (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {batches.length > 0 ? (
            batches.map((batch) => (
              <div
                key={batch._id}
                className="bg-white shadow-md rounded-lg p-4 border-l-4 border-blue-600"
              >
                <h1 className="text-xl font-semibold">{batch.batchName}</h1>
                <h1 className="flex items-center text-gray-600 font-medium mt-1">
                  <FcCalendar className="mr-2 text-xl" />
                  {new Date(batch.date).toLocaleDateString()}
                </h1>
                <h2 className="flex items-center text-gray-600 font-medium mt-1">
                  <PiStudent className="mr-2 text-xl" /> {batch.student.length}
                </h2>
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    className="bg-green-500 text-white px-3 py-1.5 rounded text-sm w-full sm:w-auto"
                    onClick={() =>
                      navigate(`/feeStatus?batchName=${batch.batchName}`)
                    }
                  >
                    Fee Status
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/Attendance?batchName=${batch.batchName}`)
                    }
                    className="bg-yellow-400 text-white px-3 py-1.5 rounded text-sm w-full sm:w-auto"
                  >
                    Take Attendance
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/getStudent?batchName=${batch.batchName}`)
                    }
                    className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm w-full sm:w-auto"
                  >
                    View Student
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-lg font-semibold">
              No batches found
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BatchCard;
