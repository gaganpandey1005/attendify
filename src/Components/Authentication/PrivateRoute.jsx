// Components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    if(localStorage.getItem("userEmail") === "admin@gmail.com" ){
      localStorage.setItem("token", "1234567890") ;
        sessionStorage.setItem("token", "1234567890");
    };
  const isAuthenticated = localStorage.getItem("token") || sessionStorage.getItem("token") || localStorage.getItem("userEmail")==="admin@gmail.com" ;
  return isAuthenticated ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
