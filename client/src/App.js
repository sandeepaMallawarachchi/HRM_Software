import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Private routes */}
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leave" element={<Leave />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="/registration" element={<EmployeeRegistration />} />
            {/* Render Sidebar and Header */}
            <Route
              path="*"
              element={
                <div className="flex h-screen">
                  <Sidebar />
                  <div className="flex-1 flex flex-col ml-[-35px]">
                    <Header />
                    <div className="flex-1 p-4 pl-10 overflow-auto bg-[#f6f5fb]">
                      {/* Content will be rendered here */}
                    </div>
                  </div>
                </div>
              }
            />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
