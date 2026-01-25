import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateNavbar = () => {
  const navigate = useNavigate();
  const { userEmail, logout } = useAuth();

  const handleLogout = async () => {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="w-full bg-[#1a1a1a] border-b border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / App Name */}
        <Link to="/dashboard">
          <h1 className="text-lg font-semibold text-[#eaeaea]">
            AskSQL
          </h1>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* User Email */}
          <span className="text-sm text-[#9ca3af]">
            {userEmail}
          </span>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm rounded-md bg-[#2a2a2a] text-[#eaeaea] hover:bg-[#333] transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default PrivateNavbar;