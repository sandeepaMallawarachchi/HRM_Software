import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaUserPlus,
  FaUserCheck,
  FaHandshake,
  FaMoneyCheckAlt,
  FaFileAlt,
  FaUserFriends,
} from "react-icons/fa";

const HRsidebar = ({ isCollapsed }) => {
  return (
    <div className="flex flex-col items-center justify-end mb-8 w-full gap-4">
      {/* Employee Relations */}
      <NavLink
        to="/employee-relations"
        className={({ isActive }) =>
          `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${
            isActive
              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
              : ""
          }`
        }
      >
        <FaHandshake
          size={20}
          className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
        />
        {!isCollapsed && <span>Employee Relations</span>}
      </NavLink>

      {/* Payroll Management */}
      <NavLink
        to="/payroll-management"
        className={({ isActive }) =>
          `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${
            isActive
              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
              : ""
          }`
        }
      >
        <FaMoneyCheckAlt
          size={20}
          className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
        />
        {!isCollapsed && <span>Payroll Management</span>}
      </NavLink>

      <NavLink
        to="/pre-approvals"
        className={({ isActive }) =>
          `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${
            isActive
              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
              : ""
          }`
        }
      >
        <FaUserFriends
          size={20}
          className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
        />
        {!isCollapsed && <span>Pre-Approvals</span>}
      </NavLink>

      {/* Policy Management */}
      <NavLink
        to="/policy-management"
        className={({ isActive }) =>
          `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${
            isActive
              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
              : ""
          }`
        }
      >
        <FaFileAlt
          size={20}
          className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
        />
        {!isCollapsed && <span>Policy Management</span>}
      </NavLink>
    </div>
  );
};

export default HRsidebar;
