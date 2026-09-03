import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Role badge styling — extend this map if you add more roles
const ROLE_STYLES = {
  admin: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  user:  "bg-blue-500/15  text-blue-400  border-blue-500/30",
};

const PrivateNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userEmail, userRole, logout } = useAuth();   // pulled userRole from context

  const handleLogout = async () => {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  // Normalise role for display — fallback to "user" if context hasn't resolved yet
  const displayRole = (userRole ?? "user").toLowerCase();
  const roleBadgeClass = ROLE_STYLES[displayRole] ?? ROLE_STYLES.user;

  return (
    <nav className="w-full bg-[#161616] border-b border-[#2a2a2a] overflow-x-hidden">
      <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

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

          {/* User Email + Role Badge */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-gray-400 max-w-[160px] truncate">
              {userEmail}
            </span>

            {/* Role Badge — NEW */}
            <span
              className={`
                inline-flex items-center
                px-2 py-0.5
                rounded-full
                text-[10px] font-semibold uppercase tracking-wide
                border
                ${roleBadgeClass}
              `}
            >
              {displayRole}
            </span>
          </div>

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