import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaUserPlus,
  FaUserCheck,
  FaHandshake,
  FaMoneyCheckAlt,
  FaFileAlt,
} from "react-icons/fa";

const Accountantsidebar = ({ isCollapsed }) => {
  return (
    <div className="flex flex-col items-center justify-end mb-8 w-full gap-4">
      {/*profits*/}
      <NavLink
        to="/profits"
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
        {!isCollapsed && <span>Profits</span>}
      </NavLink>
      {/* Employee Relations */}
      <NavLink
        to="/expences"
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
        {!isCollapsed && <span>Expences</span>}
      </NavLink>
      {/* Payroll Management */}
      <NavLink
        to="/Revenue"
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
        {!isCollapsed && <span>Revenue</span>}
      </NavLink>

      <NavLink
        to="/loansection"
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
        {!isCollapsed && <span>Loans Section</span>}
      </NavLink>
    </div>
  );
};

export default Accountantsidebar;
