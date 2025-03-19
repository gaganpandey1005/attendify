import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import BatchForm from "./CreateBatch.jsx";
import { useNavigate } from "react-router-dom";

const DashBoardHeader = () => {
  const [createBatch, setCreateBatch] = useState(false);
const navigate=useNavigate()
  return (
    <div className="mt-20 ml-4 flex flex-wrap gap-4 sm:gap-8 items-start sm:items-center">
      <h1 className="bg-blue-600 w-auto rounded text-lg sm:text-xl p-2 text-white">
        Batches
      </h1>

      <button
        className="border-2 border-blue-600 w-auto rounded text-lg sm:text-xl p-2 text-blue-600 flex items-center"
        onClick={() => setCreateBatch(true)}
      >
        <IoMdAdd className="mr-1" /> Create Batch
      </button>

      


      {createBatch && <BatchForm onClose={() => setCreateBatch(false)} />}
    </div>
  );
};

export default DashBoardHeader;
