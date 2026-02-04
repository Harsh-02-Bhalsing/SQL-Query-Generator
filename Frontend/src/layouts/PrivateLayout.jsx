import { Outlet } from "react-router-dom";
import PrivateNavbar from "../components/PrivateNavbar";
import Footer from "../components/Footer";

const PrivateLayout = () => {
  return (
    <div className="min-h-screen bg-[#121212] flex flex-col overflow-x-hidden">
      <PrivateNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PrivateLayout;