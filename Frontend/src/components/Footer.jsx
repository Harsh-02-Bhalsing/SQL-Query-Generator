const Footer = () => {
  return (
    <footer className="w-full bg-[#121212] border-t border-[#2a2a2a] overflow-x-hidden">
      <div className="w-full px-4 sm:px-6 py-2 flex flex-col sm:flex-row items-center justify-between gap-4">

        <p className="text-sm text-[#9ca3af]">
          © {new Date().getFullYear()} SQL Query Generator. All rights reserved.
        </p>

        <div className="flex gap-6 text-sm">
          <a
            href="#"
            className="text-[#9ca3af] hover:text-[#eaeaea] transition"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-[#9ca3af] hover:text-[#eaeaea] transition"
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;