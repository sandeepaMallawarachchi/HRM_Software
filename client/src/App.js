import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Import Navigate
import "./index.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Profile from "./components/Profile";
import Leave from "./pages/Leave";
import Payroll from "./pages/Payroll";
import EmployeeRegistration from "./components/profileComponents/EmployeeRegistration";
import Login from "./pages/auth/Login";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Replace with real authentication logic

  useEffect(() => {
    // Check if the auth token exists in localStorage on initial load
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true); // Set authenticated if token exists
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Redirect to login if not authenticated */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col ml-[-35px]">
                  <Header />
                  <div className="flex-1 p-4 pl-10 overflow-auto bg-[#f6f5fb]">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/leave" element={<Leave />} />
                      <Route path="/payroll" element={<Payroll />} />
                      <Route
                        path="/registration"
                        element={<EmployeeRegistration />}
                      />
                    </Routes>
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/login" /> // Redirect to login if not authenticated
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
