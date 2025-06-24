// AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";

// ** Create the context
const AuthContext = createContext();

//** ------------------Create the provider component ----------------------*/

export const AuthProvider = ({ children }) => {
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const isLoggedIn =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    setLogin(!!isLoggedIn);
  }, []);

  return (
    <AuthContext.Provider value={{ login, setLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

//**  Create a custom hook for cleaner usage
export const useAuth = () => useContext(AuthContext);
