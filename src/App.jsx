import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Landing from "./pages/Landing";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ Check localStorage on load (so SSR or refresh works)
  useEffect(() => {
    const adminFlag = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminFlag);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/admin"
          element={<AdminLogin onLoginSuccess={() => setIsAdmin(true)} />}
        />
        <Route
          path="/admin/dashboard"
          element={
            isAdmin ? <AdminDashboard /> : <Navigate to="/admin" replace />
          }
        />
      </Routes>
    </Router>
  );
}
