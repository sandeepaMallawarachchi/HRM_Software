import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Profile from "./components/Profile";
import Leave from "./pages/Leave";
import Payroll from "./pages/Payroll";
import EmployeeRegistration from "./components/profileComponents/EmployeeRegistration";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // replace with real authentication logic

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private routes */}
        {isAuthenticated && (
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
        )}

        {/* Redirect to login if not authenticated */}
        {!isAuthenticated && <Route path="*" element={<Login />} />}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
