import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaUserPlus,
  FaUserCheck,
  FaHandshake,
  FaMoneyCheckAlt,
  FaFileAlt,
} from "react-icons/fa";

const HRsidebar = ({ isCollapsed }) => {
  return (
    <div className="flex flex-col items-center justify-end mb-8 w-full gap-4">
      {/* Recruitment Management */}
      <NavLink
        to="/recruitment-management"
        className={({ isActive }) =>
          `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${
            isActive
              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
              : ""
          }`
        }
      >
        <FaUserPlus
          size={20}
          className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
        />
        {!isCollapsed && <span>Recruitment Management</span>}
      </NavLink>

      {/* Onboarding Process */}
      <NavLink
        to="/onboarding-process"
        className={({ isActive }) =>
          `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${
            isActive
              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
              : ""
          }`
        }
      >
        <FaUserCheck
          size={20}
          className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
        />
        {!isCollapsed && <span>Onboarding Process</span>}
      </NavLink>

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
