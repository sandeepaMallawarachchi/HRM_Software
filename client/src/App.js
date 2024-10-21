import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import Profile from './components/Profile';
import Payroll from './pages/Payroll';
import EmployeeRegistration from './pages/profileComponents/EmployeeRegistration';
import LeaveAndAttendance from './pages/LeaveAndAttendance';

//auth routes
import ProtectedRoute from './pages/auth/ProtectedRoute';
import Login from "./pages/auth/Login";

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div className="flex h-screen">
      {!isLoginPage && <Sidebar />}
      <div className={`flex-1 flex flex-col ${!isLoginPage ? 'ml-[-35px]' : ''}`}>
        {!isLoginPage && <Header />}
        <div className="flex-1 p-4 pl-10 overflow-auto bg-[#f6f5fb]">
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
            <Route path="/payroll" element={<ProtectedRoute element={<Payroll />} />} />
            <Route path="/registration" element={<ProtectedRoute element={<EmployeeRegistration />} />} />
            <Route path="/leave" element={<ProtectedRoute element={<LeaveAndAttendance />} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;