import React, { useState } from 'react';
import { FaHome, FaWallet, FaCalendarCheck, FaListAlt, FaBars, FaBook } from 'react-icons/fa';
import { HiOutlineX } from 'react-icons/hi';
import { Link, NavLink } from 'react-router-dom';
import logo from '../images/logo.png';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`z-50 flex flex-col ${isCollapsed ? 'w-16' : 'w-64'} pr-3 h-screen bg-white text-black shadow-xl transition-all duration-300 rounded-r-[40px] border-r relative`}>
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className="absolute top-20 right-[-16px] bg-gradient-to-r from-orange-400 to-orange-500 text-white p-2 rounded-full shadow-md hover:bg-orange-400"
      >
        {isCollapsed ? <HiOutlineX size={20} /> : <FaBars size={20} />}
      </button>

      {/* Logo and HRM Section */}
      <div className="flex flex-col items-center mt-5 w-full">
        <Link to='/dashboard'>
          <img
            src={logo}
            alt="Logo"
            className={`transition-all duration-300 ${isCollapsed ? 'w-8 h-8' : 'w-16 h-16'}`}
          />
          <span className="mt-4 text-lg transition-all duration-300">
            {!isCollapsed && 'HRM'}
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col items-center justify-end mt-4 mb-8 w-full gap-5">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${isActive ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white' : ''
            }`
          }
        >
          <FaHome size={20} className={`mr-2 ${isCollapsed ? 'mx-auto' : ''}`} />
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>
        <NavLink
          to="/payroll"
          className={({ isActive }) =>
            `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${isActive ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white' : ''
            }`
          }
        >
          <FaWallet size={20} className={`mr-2 ${isCollapsed ? 'mx-auto' : ''}`} />
          {!isCollapsed && <span>Payroll</span>}
        </NavLink>
        <NavLink
          to="/attendance"
          className={({ isActive }) =>
            `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${isActive ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white' : ''
            }`
          }
        >
          <FaCalendarCheck size={20} className={`mr-2 ${isCollapsed ? 'mx-auto' : ''}`} />
          {!isCollapsed && <span>Attendance</span>}
        </NavLink>
        <NavLink
          to="/leave"
          className={({ isActive }) =>
            `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${isActive ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white' : ''
            }`
          }
        >
          <FaListAlt size={20} className={`mr-2 ${isCollapsed ? 'mx-auto' : ''}`} />
          {!isCollapsed && <span>Leave Request</span>}
        </NavLink>
        <NavLink
          to="/learning"
          className={({ isActive }) =>
            `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${isActive ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white' : ''
            }`
          }
        >
          <FaBook size={20} className={`mr-2 ${isCollapsed ? 'mx-auto' : ''}`} />
          {!isCollapsed && <span>Learning & Development</span>}
        </NavLink>

      </div>
    </div>
  );
};

export default Sidebar;