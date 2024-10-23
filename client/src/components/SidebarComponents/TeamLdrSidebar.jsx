import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaUsers,
  FaChartLine,
  FaComments,
  FaClipboardCheck,
  FaEnvelope,
} from "react-icons/fa";

const TeamLeaderSidebar = ({ isCollapsed }) => {
  return (
    <div className="flex flex-col items-center justify-end mt-4 mb-8 w-full gap-5">
      {/* Team Management Tools Link */}
      <NavLink
        to="/team-management"
        className={({ isActive }) =>
          `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${
            isActive
              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
              : ""
          }`
        }
      >
        <FaUsers size={20} className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`} />
        {!isCollapsed && <span>Team Management</span>}
      </NavLink>

      {/* Reporting Link */}
      <NavLink
        to="/reporting"
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
        {!isCollapsed && <span>Reporting</span>}
      </NavLink>

      {/* Feedback System Link */}
      <NavLink
        to="/feedback"
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
        {!isCollapsed && <span>Feedback System</span>}
      </NavLink>

      {/* Leave Approval Link */}
      <NavLink
        to="/leave-approval"
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
        {!isCollapsed && <span>Leave Approval</span>}
      </NavLink>

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
    </div>
  );
};

export default TeamLeaderSidebar;
