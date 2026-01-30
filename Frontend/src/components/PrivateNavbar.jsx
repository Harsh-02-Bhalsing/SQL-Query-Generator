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
    <nav className="w-full bg-[#161616] border-b border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        
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
        <div className="flex items-center gap-6">
          
          {/* Navigation */}
          <div className="flex items-center gap-5">
            {!isActive("/dashboard") && (
              <Link
                to="/dashboard"
                className="text-xs text-gray-400 hover:text-gray-200 transition"
              >
                Dashboard
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
          <span className="text-xs text-gray-400 max-w-[180px] truncate">
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
