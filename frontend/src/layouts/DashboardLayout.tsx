import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";

function DashboardLayout() {
  return (
    <>
      <Sidebar />
      {/*<Navbar />*/}

      <main>
        <Outlet />
      </main>
    </>
  );
}

export default DashboardLayout;
