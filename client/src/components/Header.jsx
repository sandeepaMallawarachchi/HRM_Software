import React, { useState } from 'react';
import { FaBell, FaEnvelope, FaAngleDown } from 'react-icons/fa';
import avatar from '../images/avatar.png';
import { Link, useLocation } from 'react-router-dom';
import Support from './profileComponents/Support';

const Header = () => {

    const location = useLocation();
    const [showSupportModal, setShowSupportModal] = useState(false);

    // Function to determine the title based on the current route
    const getPageTitle = () => {
        switch (location.pathname) {
            case '/profile':
                return 'Profile';
            case '/support':
                return 'Support';
            case '/leave':
                return 'Leave Request';
            case '/payroll':
                return 'Payroll';
            default:
                return 'Dashboard';
        }
    };

    const closeModal = () => setShowSupportModal(false);

    return (
        <div className="z-0 header w-full h-auto px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-400 flex items-center justify-between">
            <div className="text-white ml-16">
                {getPageTitle()}
            </div>

            <div className='flex-grow flex justify-end gap-5 items-center pr-5'>
                <FaBell className="text-white cursor-pointer hover:text-orange-300" size={20} />
                <FaEnvelope className="text-white cursor-pointer hover:text-orange-300" size={20} />
            </div>

            {/* User Avatar and Dropdown Menu */}
            <div className="relative flex items-center border border-white rounded-full p-2 px-3 space-x-3 backdrop-blur-lg group">
                <img
                    src={avatar}
                    alt="avatar"
                    className="w-10 h-10 rounded-full border border-gray-300"
                />
                <span className="text-white cursor-pointer">
                    Sandeepa Mallawarachchi
                </span>
                <FaAngleDown className="text-white cursor-pointer hover:text-orange-300" size={20} />

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-md">
                    <ul className="py-2">
                        <Link to='/profile'><li className="px-4 py-2 hover:bg-orange-100 cursor-pointer">Profile</li></Link>
                        <li className="px-4 py-2 hover:bg-orange-100 cursor-pointer">Logout</li>
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
}

export default Header;