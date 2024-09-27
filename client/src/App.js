import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import Profile from './components/Profile';
import Leave from './pages/Leave';
import Payroll from './pages/Payroll';
import EmployeeRegistration from './pages/profileComponents/EmployeeRegistration';

const App = () => {
  return (
    <HashRouter>
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
              <Route path="/registration" element={<EmployeeRegistration />} />
            </Routes>
          </div>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
