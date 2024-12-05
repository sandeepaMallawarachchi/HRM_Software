import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaChartLine,
  FaUserTie,
  FaUsersCog,
  FaChartPie,
  FaCalendarAlt, // Added icon for meetings
} from "react-icons/fa";

const CeoSidebar = ({ isCollapsed }) => {
  return (
    <div className="flex flex-col items-center justify-end mb-8 w-full gap-4">
      {/* Strategic Insights */}
      <NavLink
        to="/strategic-insights"
        className={({ isActive }) =>
          `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${
            isActive
              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
              : ""
          }`
        }
      >
        <FaChartLine
          size={20}
          className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
        />
        {!isCollapsed && <span>Strategic Insights</span>}
      </NavLink>

      {/* Talent Management */}
      <NavLink
        to="/talent-management"
        className={({ isActive }) =>
          `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${
            isActive
              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
              : ""
          }`
        }
      >
        <FaUserTie
          size={20}
          className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
        />
        {!isCollapsed && <span>Talent Management</span>}
      </NavLink>

      {/* Decision-Making Support */}
      <NavLink
        to="/decision-support"
        className={({ isActive }) =>
          `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${
            isActive
              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
              : ""
          }`
        }
      >
        <FaChartPie
          size={20}
          className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
        />
        {!isCollapsed && <span>Decision Support</span>}
      </NavLink>

      {/* Meetings */}
      <NavLink
        to="/meetings"
        className={({ isActive }) =>
          `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${
            isActive
              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
              : ""
          }`
        }
      >
        <FaCalendarAlt
          size={20}
          className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
        />
        {!isCollapsed && <span>Meetings</span>}
      </NavLink>
    </div>
  );
};

export default CeoSidebar;
