import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Finance from "./pages/Finance";
import Attendance from "./pages/Attendance";
import Assignments from "./pages/Assignments";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar alerts={2} />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/assignments" element={<Assignments />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
