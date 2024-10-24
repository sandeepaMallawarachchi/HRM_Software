import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaClipboardCheck,
  FaChartLine,
  FaTools,
  FaComments,
  FaUserGraduate,
} from "react-icons/fa";

const MidLvlManagerSidebar = ({ isCollapsed }) => {
  return (
    <div className="flex flex-col items-center justify-end  mb-8 w-full gap-2">
      {" "}
      {/* Adjust the gap as needed */}
      {/* Performance Management Link */}
      <NavLink
        to="/performance-management"
        className={({ isActive }) =>
          `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${
            isActive
              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
              : ""
          }`
        }
      >
        <FaClipboardCheck
          size={20}
          className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
        />
        {!isCollapsed && <span>Performance Management</span>}
      </NavLink>
      {/* Resource Allocation Link */}
      <NavLink
        to="/resource-allocation"
        className={({ isActive }) =>
          `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${
            isActive
              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
              : ""
          }`
        }
      >
        <FaTools size={20} className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`} />
        {!isCollapsed && <span>Resource Allocation</span>}
      </NavLink>
      {/* Reporting and Analytics Link */}
      <NavLink
        to="/reporting-analytics"
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
        {!isCollapsed && <span>Reporting & Analytics</span>}
      </NavLink>
      {/* Conflict Resolution Link */}
      <NavLink
        to="/conflict-resolution"
        className={({ isActive }) =>
          `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${
            isActive
              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
              : ""
          }`
        }
      >
        <FaComments
          size={20}
          className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
        />
        {!isCollapsed && <span>Conflict Resolution</span>}
      </NavLink>
      {/* Training Oversight Link */}
      <NavLink
        to="/training-oversight"
        className={({ isActive }) =>
          `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${
            isActive
              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
              : ""
          }`
        }
      >
        <FaUserGraduate
          size={20}
          className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
        />
        {!isCollapsed && <span>Training Oversight</span>}
      </NavLink>
    </div>
  );
};

export default MidLvlManagerSidebar;
