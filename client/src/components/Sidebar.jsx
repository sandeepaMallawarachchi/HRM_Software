import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaWallet,
  FaCalendarCheck,
  FaListAlt,
  FaRegHeart,
  FaAngleLeft,
  FaAngleRight,
  FaTachometerAlt,
  FaBook,
  FaFire,
  FaUserTie,
  FaHandHoldingMedical,
} from "react-icons/fa";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../images/hrm withoutbackground.png";
import TeamLeaderSidebar from "../components/SidebarComponents/TeamLdrSidebar";
import MidLvlManagersidebar from "../components/SidebarComponents/MidLvlManagersidebar";
import TopLvlManagersidebar from "../components/SidebarComponents/TopLvlManagersidebar";
import CeoSidebar from "../components/SidebarComponents/CeoSidebar";
import HRsidebar from "./SidebarComponents/HRsidebar";
import AccountantSidebar from "./SidebarComponents/AccountantSidebar";
import axios from "axios";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isRecruitmentOpen, setIsRecruitmentOpen] = useState(false);
  const role = localStorage.getItem("role");
  const empId = localStorage.getItem('empId');
  const [isSupervisor, setIsSupervisor] = useState(false);

  useEffect(() => {
    const fetchAssignedEmployees = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/admin/getAssignedEmployees/${empId}`);
        if (res.data && res.data.length > 0) {
          setIsSupervisor(true);
        } else {
          setIsSupervisor(false);
        }
      } catch (error) {
        console.log(error);
        setIsSupervisor(false);
      }
    }

    fetchAssignedEmployees();
  }, [empId]);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const location = useLocation();
  const isRecruitmentActive =
    location.pathname.includes("/offers") ||
    location.pathname.includes("/onboarding");

  return (
    <div
      className={`z-50 flex flex-col ${isCollapsed ? "w-16" : "w-64"
        } pr-3 h-screen bg-white text-black shadow-xl transition-all duration-300 rounded-r-[40px] border-r relative`}
    >
      <button
        onClick={handleToggle}
        className="absolute top-20 right-[-16px] bg-gradient-to-r from-orange-400 to-orange-500 text-white p-2 rounded-full shadow-md hover:bg-orange-400"
      >
        {isCollapsed ? <FaAngleRight size={20} /> : <FaAngleLeft size={20} />}
      </button>

      <div className="flex flex-col items-center mt-5 w-full">
        <Link to="/dashboard" className="flex flex-col items-center">
          <img
            src={logo}
            alt="Logo"
            className={`transition-all duration-300 ${isCollapsed ? "w-8 h-8" : "w-16 h-16"
              }`}
          />
          {!isCollapsed && (
            <span className="mt-2 text-lg transition-all duration-300 font-serif text-center">
              GLOBAL HRM
            </span>
          )}
        </Link>
      </div>

      <div
        className={`flex flex-col items-center mt-4 mb-8 w-full gap-2 h-[80vh] ${isCollapsed ? "" : "overflow-y-auto"
          } justify-start`}
      >
        {role === "Ceo" ? (
          <NavLink
            to="/executive-dashboard"
            className={({ isActive }) =>
              `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${isActive
                ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
                : ""
              }`
            }
          >
            <FaTachometerAlt
              size={20}
              className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
            />
            {!isCollapsed && <span>Executive Dashboard</span>}
          </NavLink>
        ) : (
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${isActive
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
        )}

        <NavLink
          to="/payroll"
          className={({ isActive }) =>
            `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${isActive
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

        <NavLink
          to="/attendance"
          className={({ isActive }) =>
            `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${isActive
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

        <NavLink
          to="/leave"
          className={({ isActive }) =>
            `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${isActive
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

        {isSupervisor &&
          <NavLink
            to="/supervisor"
            className={({ isActive }) =>
              `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${isActive
                ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
                : ""
              }`
            }
          >
            <FaUserTie
              size={20}
              className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
            />
            {!isCollapsed && <span>Supervisor Dashboard</span>}
          </NavLink>
        }

        {role !== "HR" && role !== "Ceo" && (
          <NavLink
            to="/learn"
            className={({ isActive }) =>
              `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${isActive
                ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
                : ""
              }`
            }
          >
            <FaBook
              size={20}
              className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
            />
            {!isCollapsed && <span>Learning & Development</span>}
          </NavLink>
        )}

        {/* Check if user is HR before showing recruitment submenu */}
        {role === "HR" && (
          <NavLink
            to="#"
            onClick={() => setIsRecruitmentOpen(!isRecruitmentOpen)}
            className={`flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${isRecruitmentActive
              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
              : ""
              }`}
          >
            <FaFire
              size={20}
              className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
            />
            {!isCollapsed && <span>Recruitment</span>}
          </NavLink>
        )}

        <NavLink
          to="/medical"
          className={({ isActive }) =>
            `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${isActive
              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
              : ""
            }`
          }
        >
          <FaHandHoldingMedical
            size={20}
            className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
          />
          {!isCollapsed && <span>Medical Claims</span>}
        </NavLink>

        {/* Offers and Onboarding Submenu (only visible to HR) */}
        {role === "HR" && isRecruitmentOpen && !isCollapsed && (
          <div className="w-full pl-10 space-y-2">
            <NavLink
              to="/offers"
              className={({ isActive }) =>
                `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${isActive
                  ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
                  : ""
                }`
              }
            >
              <FaFire
                size={20}
                className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
              />
              {!isCollapsed && <span>Offers</span>}
            </NavLink>

            <NavLink
              to="/onboarding"
              className={({ isActive }) =>
                `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${isActive
                  ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
                  : ""
                }`
              }
            >
              <FaBook
                size={20}
                className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
              />
              {!isCollapsed && <span>Onboarding</span>}
            </NavLink>
          </div>
        )}

        {role === "Team Leader" && (
          <TeamLeaderSidebar isCollapsed={isCollapsed} />
        )}
        {role === "Mid Lvl Manager" && (
          <MidLvlManagersidebar isCollapsed={isCollapsed} />
        )}
        {role === "Top Lvl Manager" && (
          <TopLvlManagersidebar isCollapsed={isCollapsed} />
        )}
        {role === "Ceo" && <CeoSidebar isCollapsed={isCollapsed} />}
        {role === "HR" && <HRsidebar isCollapsed={isCollapsed} />}
        {role === "Accountant" && (
          <AccountantSidebar isCollapsed={isCollapsed} />
        )}
        <NavLink
          to="/newspaper"
          className={({ isActive }) =>
            `flex items-center p-3 text-gray-600 hover:bg-orange-100 w-full rounded-r-[30px] transition-colors ${isActive
              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
              : ""
            }`
          }
        >
          <FaRegHeart
            size={20}
            className={`mr-2 ${isCollapsed ? "mx-auto" : ""}`}
          />
          {!isCollapsed && <span>Newspaper</span>}
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
