import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Outlet } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated,loading } = useAuth();

  if(loading) return null;
  return isAuthenticated ? <Outlet/> : <Navigate to="/login" />;
};

export default PrivateRoute;