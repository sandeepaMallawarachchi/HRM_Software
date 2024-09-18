import React from 'react';
import avatar from '../images/avatar.png';
import Sidebar from './Sidebar';

const Header = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1">
            <header className="w-full h-auto px-4 py-2 bg-gradient-to-r from-[#fa7c10] to-[#ffad33] flex items-center justify-between">
            <div className="text-xl text-white">
                        Dashboard
                    </div>
                    <div className="relative flex items-center border border-orange-500 rounded-full p-2 px-3 space-x-3 backdrop-blur-md group">
                        <img
                            src={avatar}
                            alt="avatar"
                            className="w-10 h-10 rounded-full border border-gray-300"
                        />
                        <span className="text-white cursor-pointer">
                            Sandeepa Mallawarachchi
                        </span>
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-md">
                            <ul className="py-2">
                                <li className="px-4 py-2 hover:bg-orange-100 cursor-pointer">Profile</li>
                                <li className="px-4 py-2 hover:bg-orange-100 cursor-pointer">Change Password</li>
                                <li className="px-4 py-2 hover:bg-orange-100 cursor-pointer">Logout</li>
                                <li className="px-4 py-2 hover:bg-orange-100 cursor-pointer">Support</li>
                            </ul>
                        </div>
                    </div>
                </header>
            </div>
        </div>
    );
}

export default Header;