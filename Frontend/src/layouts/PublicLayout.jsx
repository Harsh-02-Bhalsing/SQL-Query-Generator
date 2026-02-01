import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import Footer from "../components/Footer";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-[#121212] flex flex-col overflow-x-hidden">
      <PublicNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;