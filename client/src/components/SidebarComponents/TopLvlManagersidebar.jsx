import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaChartPie,
  FaUserTie,
  FaTachometerAlt,
  FaMoneyBillWave,
  FaClipboardList,
  FaEnvelope,
} from "react-icons/fa";

const TopLvlManagerSidebar = ({ isCollapsed }) => {
  return (
    <div className="flex flex-col items-center justify-end  mb-8 w-full gap-2">
      {" "}
      {/* Communication Tools Link */}
      <NavLink
        to="/communication"
        className={({ isActive }) =>
          `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${
            isActive
              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
              : ""
          }`
        }
      >
        <FaEnvelope
          size={20}
          className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
        />
        {!isCollapsed && <span>Communication Tools</span>}
      </NavLink>
      {/* Strategic Planning Link */}
      <NavLink
        to="/strategic-planning"
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
        {!isCollapsed && <span>Strategic Planning</span>}
      </NavLink>
      {/* Performance Dashboards Link */}
      <NavLink
        to="/performance-dashboards"
        className={({ isActive }) =>
          `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${
            isActive
              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
              : ""
          }`
        }
      >
        <FaTachometerAlt
          size={20}
          className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
        />
        {!isCollapsed && <span>Performance Dashboards</span>}
      </NavLink>
      {/* Budgeting Link */}
      <NavLink
        to="/budgeting"
        className={({ isActive }) =>
          `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${
            isActive
              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
              : ""
          }`
        }
      >
        <FaMoneyBillWave
          size={20}
          className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
        />
        {!isCollapsed && <span>Budgeting</span>}
      </NavLink>
    </div>
  );
};

export default TopLvlManagerSidebar;
