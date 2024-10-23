import React, { useState } from "react";
import {
  FaHome,
  FaWallet,
  FaCalendarCheck,
  FaListAlt,
  FaAngleLeft,
  FaBook,
  FaBookReader,
  FaCheckDouble,
  FaGripfire,
  FaAngleRight,
} from "react-icons/fa";

import { Link, NavLink } from "react-router-dom";
import logo from "../images/hrm withoutbackground.png";
import TeamLeaderSidebar from "../components/SidebarComponents/TeamLdrSidebar"; // Import the TeamLeaderSidebar component

const Sidebar = ({ userRole }) => {
  // Accept userRole as a prop
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isRecruitmentOpen, setIsRecruitmentOpen] = useState(false); // For toggling Recruitment submenu

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`z-50 flex flex-col ${
        isCollapsed ? "w-16" : "w-64"
      } pr-3 h-screen bg-white text-black shadow-xl transition-all duration-300 rounded-r-[40px] border-r relative`}
    >
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className="absolute top-20 right-[-16px] bg-gradient-to-r from-orange-400 to-orange-500 text-white p-2 rounded-full shadow-md hover:bg-orange-400"
      >
        {isCollapsed ? <FaAngleRight size={20} /> : <FaAngleLeft size={20} />}
      </button>

      {/* Logo and HRM Section */}
      <div className="flex flex-col items-center mt-5 w-full">
        <Link to="/dashboard" className="flex flex-col items-center">
          <img
            src={logo}
            alt="Logo"
            className={`transition-all duration-300 ${
              isCollapsed ? "w-8 h-8" : "w-16 h-16"
            }`}
          />
          {!isCollapsed && (
            <span className="mt-2 text-lg transition-all duration-300 font-serif text-center">
              GLOBAL HRM
            </span>
          )}
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col items-center justify-end mt-4 mb-8 w-full gap-5">
        {/* Dashboard Link */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${
              isActive
                ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
                : ""
            }`
          }
        >
          <FaHome
            size={20}
            className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
          />
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>

        {/* Payroll Link */}
        <NavLink
          to="/payroll"
          className={({ isActive }) =>
            `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${
              isActive
                ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
                : ""
            }`
          }
        >
          <FaWallet
            size={20}
            className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
          />
          {!isCollapsed && <span>Payroll</span>}
        </NavLink>

        {/* Attendance & Time Link */}
        <NavLink
          to="/attendance"
          className={({ isActive }) =>
            `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${
              isActive
                ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
                : ""
            }`
          }
        >
          <FaCalendarCheck
            size={20}
            className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
          />
          {!isCollapsed && <span>Attendance & Time</span>}
        </NavLink>

        {/* Leave & Attendance Link */}
        <NavLink
          to="/leave"
          className={({ isActive }) =>
            `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${
              isActive
                ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
                : ""
            }`
          }
        >
          <FaListAlt
            size={20}
            className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
          />
          {!isCollapsed && <span>Leave & Attendance</span>}
        </NavLink>

        {/* Learning & Development Link */}
        <NavLink
          to="/learn"
          className={({ isActive }) =>
            `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${
              isActive
                ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
                : ""
            }`
          }
        >
          <FaBookReader
            size={20}
            className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
          />
          {!isCollapsed && <span>Learning & Development</span>}
        </NavLink>

        {/* Recruitment Link */}
        <NavLink
          to="#"
          onClick={() => setIsRecruitmentOpen(!isRecruitmentOpen)}
          className="flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors"
        >
          <FaCheckDouble
            size={20}
            className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
          />
          {!isCollapsed && <span>Recruitment</span>}
        </NavLink>

        {/* Offers and Onboarding Submenu */}
        {isRecruitmentOpen && !isCollapsed && (
          <div className="ml-8">
            <NavLink
              to="/offers"
              className="flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors"
            >
              <FaGripfire size={20} className="mr-2" />
              <span>Offers</span>
            </NavLink>

            <NavLink
              to="/onboarding"
              className="flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors"
            >
              <FaBook size={20} className="mr-2" />
              <span>Onboarding</span>
            </NavLink>
          </div>
        )}

        {userRole === "teamLeader" && (
          <TeamLeaderSidebar isCollapsed={isCollapsed} />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
