import {Link} from "react-router-dom"
const PublicNavbar = () => {
  return (
    <nav className="w-full bg-[#1a1a1a] border-b border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        {/* Logo / App Name */}
        <Link to="/" className="flex items-center gap-0">
          <img
            src="/AskSQL_logo.png"
            alt="AskSQL logo"
            className="h-12 w-12 object-contain"
          />
          <span className="text-[1.35rem] font-semibold text-[#eaeaea]">
            AskSQL
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <Link to="/login"
            className="text-sm text-[#9ca3af] hover:text-[#eaeaea] transition"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-4 py-2 text-sm rounded-md bg-[#2a2a2a] text-[#eaeaea] hover:bg-[#333] transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;