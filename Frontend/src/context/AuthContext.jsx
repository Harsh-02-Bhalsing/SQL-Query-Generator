import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [userId,setUserId]=useState(null)

  const login = (email,userId) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    setUserId(userId);
    console.log(userId);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userEmail,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
