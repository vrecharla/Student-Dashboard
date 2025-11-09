// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Academic from "./pages/Academic";
import Attendance from "./pages/Attendance";
import Finance from "./pages/Finance";
import Profile from "./pages/Profile";
import Login from "./pages/Login";

function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar alerts={2} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <ShellLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/academic" element={<Academic />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/financial" element={<Finance />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ShellLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
