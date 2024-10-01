import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import Profile from './components/Profile';
import Leave from './pages/Leave';
import Payroll from './pages/Payroll';
import EmployeeRegistration from './pages/profileComponents/EmployeeRegistration';
import Login from "./pages/auth/Login";
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the auth token exists in localStorage on initial load
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true); // Set authenticated if token exists
    }
  }, []);

  return (
    <HashRouter>
      <div className="flex h-screen">
        {isAuthenticated && <Sidebar />} {/* Show Sidebar only if authenticated */}
        <div className="flex-1 flex flex-col ml-[-35px]">
          {isAuthenticated && <Header />} {/* Show Header only if authenticated */}
          <div className="flex-1 p-4 pl-10 overflow-auto bg-[#f6f5fb]">
            <Routes>
              {/* If user is not authenticated, show the login page at root */}
              <Route path="/" element={isAuthenticated ? <Dashboard /> : <Login setIsAuthenticated={setIsAuthenticated} />} />

              {/* Protecting other routes using PrivateRoute */}
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/leave" element={<PrivateRoute><Leave /></PrivateRoute>} />
              <Route path="/payroll" element={<PrivateRoute><Payroll /></PrivateRoute>} />
              <Route path="/registration" element={<PrivateRoute><EmployeeRegistration /></PrivateRoute>} />
            </Routes>
          </div>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;