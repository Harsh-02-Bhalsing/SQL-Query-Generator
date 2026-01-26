const PublicNavbar = () => {
  return (
    <nav className="w-full bg-[#1a1a1a] border-b border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / App Name */}
        <h1 className="text-lg font-semibold text-[#eaeaea]">
          AskSQL
        </h1>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <a
            href="#features"
            className="text-sm text-[#9ca3af] hover:text-[#eaeaea] transition"
          >
            Features
          </a>

          <a
            href="/signup"
            className="px-4 py-2 text-sm rounded-md bg-[#2a2a2a] text-[#eaeaea] hover:bg-[#333] transition"
          >
            Sign Up
          </a>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;