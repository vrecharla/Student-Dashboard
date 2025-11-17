import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Academic from "./pages/Academic";
import Attendance from "./pages/Attendance";
import Finance from "./pages/Finance";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import { getToken } from "./lib/auth";
import Bottom from "./components/Bottom";

function ShellLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mode, setMode] = React.useState<"desktop" | "tablet" | "mobile">("desktop");

  // detect screen size
  React.useEffect(() => {
    const update = () => {
      const w = window.innerWidth;

      if (w < 768) {
        setMode("mobile");
        setCollapsed(true); // fully hidden
      } else if (w < 1000) {
        setMode("tablet");
        setCollapsed(true); // collapsed but visible
      } else {
        setMode("desktop");
        setCollapsed(false); // expanded
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const isMobile = mode === "mobile";
  const isTablet = mode === "tablet";
  const isDesktop = mode === "desktop";

  const sidebarOpen = !collapsed;

  // handle link click
  function handleItemSelect() {
    if (isMobile) {
      setCollapsed(true);
    } else if (isTablet) {
      setCollapsed(true);
    }
  }

  return (
    <div className="h-screen flex overflow-hidden relative">

      {/* SIDEBAR */}
      <div
        className={`
          fixed top-0 left-0 h-full z-50 transition-transform duration-300
          ${
            isMobile
              ? sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : isTablet
              ? sidebarOpen
                ? "translate-x-0"
                : "translate-x-0"
              : "translate-x-0"
          }
        `}
        style={{
          width: collapsed ? "5rem" : "16rem",
        }}
      >
        <Sidebar
          collapsed={collapsed}
          onToggle={(next) => {
            setCollapsed(next);
          }}
          onItemSelect={handleItemSelect}
        />
      </div>

      {/* OVERLAY FOR MOBILE + TABLET WHEN EXPANDED */}
      {(isMobile || isTablet) && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* MAIN CONTENT */}
      <div
        className="flex-1 flex flex-col overflow-y-auto"
        style={{
          marginLeft: isDesktop
            ? collapsed
              ? "5rem"
              : "16rem"
            : isTablet
            ? "5rem" // collapsed width
            : 0,
        }}
      >
        <Topbar
          onMenuClick={() => {
            if (isMobile || isTablet) setCollapsed(false);
          }}
        />

        <main className="flex-1 p-4">{children}</main>
        <Bottom />
      </div>
    </div>
  );
}

export default function App() {
  const authed = Boolean(getToken());

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            authed ? (
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
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
