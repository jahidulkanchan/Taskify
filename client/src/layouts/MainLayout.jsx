import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div className="mt-[50px]">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
