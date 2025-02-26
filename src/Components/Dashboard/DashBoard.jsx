import React from 'react'
import { FcCalendar } from 'react-icons/fc';
import { IoMdAdd } from "react-icons/io";
import { PiStudent } from 'react-icons/pi';
import DashBoardHeader from './DashBoardHeader';
const DashBoard = () => {
  return (
    <div>
     <DashBoardHeader/>
      <div className='bg-gray-200 w-80 rounded border-blue-600 border-3 p-4 mt-4 ml-4'>
        <h1 className='text-xl font-semibold'>Batch A</h1>
        <h1 className='flex font-semibold'><FcCalendar className='mt-1 mr-2 text-xl'/> Date</h1>
        <h2 className='flex font-semibold'><PiStudent className='mt-1 mr-2 text-xl'/> Students</h2>
        <div className='flex gap-10'>
            <button className='bg-green-500 px-3 py-1.5 mt-3 rounded w-auto '> View  </button>
            <button className='bg-yellow-400 px-3 py-1.5 mt-3 rounded w-auto '> Take Attendance </button>
        </div>

      </div>
    </div>
  );
}

export default DashBoard