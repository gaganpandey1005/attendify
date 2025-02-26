import React from 'react'
import { useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import BatchForm from './CreateBatch.jsx'
const DashBoardHeader = () => {
  const [createBatch, setcreateBatch] = useState(false)
  return (
     <div className=" mt-19 ml-4 gap-8 flex">
            <h1 className="bg-blue-600 w-auto rounded text-xl p-2 text-white">
              Batches
            </h1>
            <button className="border-2 border-blue-600 w-auto rounded text-xl p-2 text-blue-600 text-2xl  flex" onClick={()=>setcreateBatch(true)}>
              <IoMdAdd className='mt-1 mr-1' /> Create Batch
            </button>
            {createBatch && <BatchForm onClose={()=>{setcreateBatch(false)}}/>}
          </div>
  )
}

export default DashBoardHeader