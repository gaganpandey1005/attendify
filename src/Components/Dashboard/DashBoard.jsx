import React, { useState, useEffect } from "react";
import { FcCalendar } from "react-icons/fc";
import { IoMdAdd } from "react-icons/io";
import { PiStudent } from "react-icons/pi";
import DashBoardHeader from "./DashBoardHeader";
import axios from "axios";
import { toast } from "react-toastify";

const DashBoard = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Unauthorized: No token found");
          return;
        }

        const res = await axios.get(
          "https://attendify-backend-szi8.onrender.com/api/getBatch",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBatches(res.data.batches);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch batches");
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  return (
    <div>
      <DashBoardHeader />

      {loading ? (
        <p className="text-center mt-4">Loading...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4 p-4">
          {batches.length > 0 ? (
            batches.map((batch) => (
              <div
                key={batch._id}
                className="bg-gray-200 rounded border-blue-600 border-3 p-4"
              >
                <h1 className="text-xl font-semibold">{batch.batchName}</h1>
                <h1 className="flex font-semibold">
                  <FcCalendar className="mt-1 mr-2 text-xl" />{" "}
                  {new Date(batch.date).toLocaleDateString()}
                </h1>
                <h2 className="flex font-semibold">
                  <PiStudent className="mt-1 mr-2 text-xl" /> Students: 0{" "}
                  {/* Replace 0 with actual student count */}
                </h2>
                <div className="flex gap-10">
                  <button className="bg-green-500 px-3 py-1.5 mt-3 rounded">
                    View
                  </button>
                  <button className="bg-yellow-400 px-3 py-1.5 mt-3 rounded">
                    Take Attendance
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No batches found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DashBoard;
