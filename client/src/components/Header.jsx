import React, { useEffect, useState } from "react";
import { FaBell, FaEnvelope, FaAngleDown } from "react-icons/fa";
import defaultAvatar from "../images/avatar.png";
import { Link, useLocation } from "react-router-dom";
import Support from "../pages/profileComponents/Support";
import axios from "axios";
import ProfilePicture from "./subComponents/ProfilePicture";

const Header = () => {
  const location = useLocation();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [empName, setEmpName] = useState("");
  const [avatar, setAvatar] = useState(defaultAvatar);

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

        if (response.data.profilepic) {
          setAvatar(`http://localhost:4000${response.data.profilepic}`);
        }
      } catch (err) {
        console.log("Error fetching employee name:", err);
      }
    };

    fetchName();
  }, []);

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/profile":
        return "Profile";
      case "/support":
        return "Support";
      case "/leave":
        return "Leave & Attendance";
      case "/payroll":
        return "Payroll";
      case "/registration":
        return "Registration";
      case "/attendance":
        return "Attendance & Time";
      case "/learn":
        return "Learning & Development";
      case "/offers":
        return "Offers";
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

  return (
    <div className="z-0 header w-full h-auto px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-400 flex items-center justify-between">
      <div className="text-white ml-16">{getPageTitle()}</div>

      <div className="flex-grow flex justify-end gap-5 items-center pr-5">
        <FaBell
          className="text-white cursor-pointer hover:text-orange-300"
          size={20}
        />
        <FaEnvelope
          className="text-white cursor-pointer hover:text-orange-300"
          size={20}
        />
      </div>

      <div className="relative flex items-center border border-white rounded-full p-2 px-3 space-x-3 backdrop-blur-lg group">
        <div className='w-10 justify-center rounded-full'>
          <ProfilePicture />
        </div>
        <span className="text-white cursor-pointer">
          {empName.name}
        </span>
        <FaAngleDown className="text-white cursor-pointer hover:text-orange-300" size={20} />

        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-md">
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
      </div>

      {showSupportModal && <Support onClose={closeModal} />}
    </div>
  );
};

export default Header;
