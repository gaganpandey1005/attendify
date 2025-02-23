import React from 'react'
import SignUp from './Components/Authentication/SignUp'
import Navbar from './Components/NavBar'
import SignIn from './Components/Authentication/SignIn'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <>
      <Navbar />
    <Routes>
<Route path='/' element={<SignUp />} />
<Route path='/signup' element={<SignUp />} />
<Route path='/signin' element={<SignIn />} />

    
    
    </Routes>
    </>
  )
}

export default App