import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userEmail, logout } = useAuth();

  const handleLogout = async () => {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="w-full bg-[#161616] border-b border-[#2a2a2a] overflow-x-hidden">
      <div className="w-full px-4 sm:px-6 h-auto sm:h-14 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <img
            src="/AskSQL_logo.png"
            alt="AskSQL logo"
            className="h-9 w-9 object-contain"
          />
          <span className="text-[1.25rem] font-semibold text-gray-200 tracking-tight">
            AskSQL
          </span>
        </Link>

        {/* Right Section */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-end">

          
          {/* Navigation */}
          <div className="flex flex-wrap items-center gap-4">

            {!isActive("/dashboard") && (
              <Link
                to="/dashboard"
                className="text-xs text-gray-400 hover:text-gray-200 transition"
              >
                Dashboard
              </Link>
            )}

            {!isActive("/schema") && (
              <Link
                to="/schema"
                className="text-xs text-gray-400 hover:text-gray-200 transition"
              >
                Schema
              </Link>
            )}

            {!isActive("/history") && (
              <Link
                to="/history"
                className="text-xs text-gray-400 hover:text-gray-200 transition"
              >
                History
              </Link>
            )}
          </div>

          {/* User Email */}
          <span className="text-xs text-gray-400 max-w-full sm:max-w-[180px] truncate">
            {userEmail}
          </span>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="
              px-3 py-1.5
              text-xs font-medium
              rounded-md
              border border-red-500/30
              text-red-400
              hover:bg-red-500/10
              hover:text-red-300
              transition
            "
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default PrivateNavbar;
