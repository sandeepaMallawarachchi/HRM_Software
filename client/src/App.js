import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import Profile from './components/Profile';
import Leave from './pages/Leave';
import Payroll from './pages/Payroll';
import EmployeeRegistration from './pages/profileComponents/EmployeeRegistration';
import Login from "./pages/auth/Login";
import PrivateRoute from './components/PrivateRoute';
import Logout from './pages/auth/Logout'; // Import Logout component

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the auth token exists in localStorage on initial load
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      console.log(token);
    }
  }, []);

  return (
    <HashRouter>
      <div className="flex h-screen">
        {/* Only show Sidebar and Header if authenticated */}
        {isAuthenticated && <Sidebar />}
        <div className="flex-1 flex flex-col ml-[-35px]">
          {isAuthenticated && <Header />}
          <div className="flex-1 p-4 pl-10 overflow-auto bg-[#f6f5fb]">
            <Routes>
              {/* Redirect root to Login page */}
              <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

              {/* Dashboard at /dashboard, protected by PrivateRoute */}
              <Route path="/dashboard" element={<PrivateRoute isAuthenticated={isAuthenticated}><Dashboard /></PrivateRoute>} />

              {/* Protecting other routes using PrivateRoute */}
              <Route path="/profile" element={<PrivateRoute isAuthenticated={isAuthenticated}><Profile /></PrivateRoute>} />
              <Route path="/leave" element={<PrivateRoute isAuthenticated={isAuthenticated}><Leave /></PrivateRoute>} />
              <Route path="/payroll" element={<PrivateRoute isAuthenticated={isAuthenticated}><Payroll /></PrivateRoute>} />
              <Route path="/registration" element={<PrivateRoute isAuthenticated={isAuthenticated}><EmployeeRegistration /></PrivateRoute>} />

              {/* Logout Route */}
              <Route path="/logout" element={<Logout setIsAuthenticated={setIsAuthenticated} />} />

              {/* Optional: Redirect authenticated users from login to dashboard */}
              {/* <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />} /> */}
            </Routes>
          </div>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
