import React, { useEffect, useState, useRef } from "react";
import { FaAngleDown } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import Support from "../pages/profileComponents/Support";
import axios from "axios";
import ProfilePicture from "./subComponents/ProfilePicture";
import ReminderIcon from "./subComponents/ReminderIcon";
import MessageIcon from "./subComponents/MessageIcon";

const Header = () => {
  const location = useLocation();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [empName, setEmpName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchName = async () => {
      const empId = localStorage.getItem("empId");

      if (!empId) {
        console.error("Employee Id is not found in localStorage");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:4000/employees/getPersonalDetails/${empId}`
        );
        setEmpName(response.data);
      } catch (err) {
        console.log("Error fetching employee name:", err);
      }
    };

    fetchName();
  }, []);

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/profile":
        return "Profile";
      case "/payroll":
        return "Payroll";
      case "/registration":
        return "Registration";
      case "/leave":
        return "Leave & Attendance";
      case "/attendance":
        return "Attendance & Time";
      case "/learn":
        return "Learning & Development";
      case "/offers":
        return "Offers";
      case "/onboarding":
        return "Onboarding";
      case "/team-management":
        return "Team Management";
      case "/reporting":
        return "Reporting";
      case "/communication":
        return "Communication Tool";
      case "/performance-management":
        return "Performance Management";
      case "/resource-allocation":
        return "Resource Allocation";
      case "/reporting-analytics":
        return "Reports & Analytics";
      case "/conflict-resolution":
        return "Conflict Resolution";
      case "/training-oversight":
        return "Training Oversight";
      case "/strategic-planning":
        return "Strategic Planning";
      case "/performance-dashboards":
        return "Performance Dashboards";
      case "/succession-planning":
        return "Succession Planning";
      case "/budgeting":
        return "Budgeting";
      case "/compliance-tracking":
        return "Compliance Tracking";
      case "/expences":
        return "Expenses";
      case "/profits":
        return "Profits";
      case "/Revenue":
        return "Revenue";
      case "/executive-dashboard":
        return "Executive Dashboard";
      case "/strategic-insights":
        return "Strategic Insights";
      case "/talent-management":
        return "Talent Management";
      case "/culture-engagement":
        return "Culture & Engagement";
      case "/decision-support":
        return "Decision Support";
      case "/reminders":
        return "Reminders";
      default:
        return "Dashboard";
    }
  };

  const closeModal = () => setShowSupportModal(false);

  const handleLogout = () => {
    const confirm = window.confirm("Are you sure you want to log out?");
    if (confirm) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("empId");

      window.location.href = "/";
    }
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="z-0 header w-full h-auto px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-400 flex items-center justify-between">
      <div className="text-white ml-16">{getPageTitle()}</div>

      <div className="flex-grow flex justify-end gap-5 items-center pr-5">
        <ReminderIcon />
        <MessageIcon />
      </div>

      <div
        ref={dropdownRef}
        className="relative flex items-center border border-white rounded-full p-2 px-3 space-x-3 backdrop-blur-lg group cursor-pointer"
        onClick={toggleDropdown}
      >
        <div className="w-10 justify-center rounded-full">
          <ProfilePicture />
        </div>
        <span className="text-white">{empName.name}</span>
        <FaAngleDown
          className="text-white hover:text-orange-300"
          size={20}
        />

        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg backdrop-blur-md">
            <ul className="py-2">
              <Link to="/profile">
                <li className="px-4 py-2 hover:bg-orange-100 cursor-pointer">
                  Profile
                </li>
              </Link>
              <li
                onClick={handleLogout}
                className="px-4 py-2 hover:bg-orange-100 cursor-pointer"
              >
                Logout
              </li>
              <li
                onClick={() => setShowSupportModal(true)}
                className="px-4 py-2 hover:bg-orange-100 cursor-pointer"
              >
                Support
              </li>
            </ul>
          </div>
        )}
      </div>

      {showSupportModal && <Support onClose={closeModal} />}
    </div>
  );
};

export default Header;