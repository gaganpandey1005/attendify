import React, { useState } from "react";
import { useNavigate } from 
"react-router-dom";

import { useEffect, } from "react";
import TeacherNameCards from "./techerNameCards.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const AdminDashBoard =  () => {
   const token = localStorage.getItem("token");

   if (!token) {
     alert("user is not authenticated please login again");
     return;
   }
  const navigate = useNavigate();
  const [data, setdata] = useState({
    batches:[],
    teachers:[],
    students:[],
  })
  useEffect(() => {
    const fetchData=async()=>{
        try{
          const res = await axios.get(
            "http://localhost:5000/api/getAllDetails"
          );
          setdata({
            batches:res.data.batches,
            teachers:res.data.teachers,
            students:res.data.students
          });



        }catch(err){
          toast.error(err);
        }
    };
    fetchData();
  
   
  }, [])
  
  
  return (
    <>
      <div className="mt-15 bg-gray-100 p-6">
        <div className="flex flex-wrap gap-8 justify-start   mb-8">
          <div className="bg-gray-200 shadow-blue-200 shadow-lg rounded-3xl p-2 w-26  h-18 text-center transition-transform transform hover:scale-105">
            <h1 className="text-xl font-semibold text-gray-800">Batches</h1>
            <p className="font-bold text-blue-600">{data.batches.length} </p>
          </div>
          <div className="bg-gray-200 shadow-blue-200 shadow-lg rounded-3xl p-2 w-26 h-18 text-center transition-transform transform hover:scale-105">
            <h1 className="text-xl font-semibold text-gray-800">Students</h1>
            <p className="font-bold text-blue-600">{data.students.length}</p>
          </div>
          <div className="bg-gray-200 shadow-blue-200 shadow-lg rounded-3xl p-2 w-26 h-18 text-center transition-transform transform hover:scale-105">
            <h1 className="text-xl font-semibold text-gray-800">Teachers</h1>
            <p className="font-bold text-blue-600">{data.teachers.length}</p>
          </div>
          
        </div>

        <TeacherNameCards  teachers={data.teachers} />
      </div>
    </>
  );
};

export default AdminDashBoard;
