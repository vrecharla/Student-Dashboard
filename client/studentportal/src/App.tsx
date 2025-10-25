import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function App() {
  return (
    <BrowserRouter>
      <div className="h-full flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar alerts={2} />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
