import React from 'react';
import avatar from '../images/avatar.png';

const Header = () => {
  return (
    <header className="w-full h-auto p-4 bg-blue-300 border-b border-blue-400 flex items-center justify-between">
      <div className="text-xl font-bold text-gray-700">
        Dashboard
      </div>
      <div className="relative flex items-center border border-blue-400 rounded-full p-2 px-3 space-x-3 bg-blue-400 bg-opacity-70 backdrop-blur-md group">
        <img 
          src={avatar} 
          alt="avatar" 
          className="w-10 h-10 rounded-full border border-gray-300"
        />
        <span className="text-gray-700 cursor-pointer">
          Sandeepa Mallawarachchi
        </span>
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-md">
          <ul className="py-2">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Change Password</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Support</li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;