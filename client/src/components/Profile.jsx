import React, { useEffect, useState } from 'react';
import axios from 'axios'
import defaultAvatar from '../images/avatar.png'; // Ensure you import your default avatar
import AccountSecurity from './profileComponents/AccountSecurity';
import PersonalDetails from './profileComponents/PersonalDetails';
import WorkInformation from './profileComponents/WorkInformation';
import Resume from './profileComponents/Resume';
import { FaEdit } from 'react-icons/fa';

const Profile = () => {
    const [visibleSection, setVisibleSection] = useState('account');
    const [avatar, setAvatar] = useState(defaultAvatar); // Set the default avatar here
    const [isHovered, setIsHovered] = useState(false);
    const [empDetails, setEmpDetails] = useState('');

    useEffect(() => {
        const fetchName = async () => {
            // Retrieve id from localStorage
            // const id = localStorage.getItem("id");
            const id = 1;

            if (!id) {
                console.error("ID is not found in localStorage");
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:4000/employees/getEmployee/${id}`
                );
                setEmpDetails(response.data);
            } catch (err) {
                console.log("Error fetching employee:", err);
            }
        };

        fetchName();
    }, []);

    const handleSectionToggle = (section) => {
        setVisibleSection(visibleSection === section ? null : section);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result); // Update avatar with new image
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="p-6 h-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Profile Picture, Profile Info, and Contact Info */}
                <div className="space-y-6">
                    {/* Profile Picture */}
                    <div
                        className="flex justify-center mt-8 relative"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-orange-500">
                            <img src={avatar} alt="Profile" className="object-cover w-full h-full" />
                            {isHovered && (
                                <label className="absolute inset-0 flex items-center justify-center cursor-pointer">
                                    <span className="bg-white rounded-full p-2 shadow-lg bg-opacity-50">
                                        <FaEdit />
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="grid grid-cols-1 gap-5 pl-5">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700">{empDetails.username}</h2>
                            <p className="text-sm text-gray-500">Senior Software Engineer</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Supervisor</p>
                            <p className="text-sm text-gray-700">John Doe</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Work Email</p>
                            <p className="text-sm text-gray-700">sandeepa.mallawarachchi@hrm.com</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Work Phone</p>
                            <p className="text-sm text-gray-700">+94 712345678</p>
                        </div>
                    </div>
                </div>

                {/* Right Column - Section Toggles and Display */}
                <div className="md:col-span-2 space-y-4">
                    {/* Buttons to toggle sections */}
                    <div className="flex space-x-6 mt-4">
                        <button
                            onClick={() => handleSectionToggle('account')}
                            className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${visibleSection === 'account' ? 'bg-orange-500 text-white' : ''}`}
                        >
                            Account Security
                        </button>
                        <button
                            onClick={() => handleSectionToggle('work')}
                            className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${visibleSection === 'work' ? 'bg-orange-500 text-white' : ''}`}
                        >
                            Work Information
                        </button>
                        <button
                            onClick={() => handleSectionToggle('resume')}
                            className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${visibleSection === 'resume' ? 'bg-orange-500 text-white' : ''}`}
                        >
                            Resume
                        </button>
                        <button
                            onClick={() => handleSectionToggle('personal')}
                            className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${visibleSection === 'personal' ? 'bg-orange-500 text-white' : ''}`}
                        >
                            Personal Details
                        </button>
                    </div>

                    {/* Conditional Rendering of Sections */}
                    {visibleSection === 'account' && <AccountSecurity />}
                    {visibleSection === 'personal' && <PersonalDetails />}
                    {visibleSection === 'work' && <WorkInformation />}
                    {visibleSection === 'resume' && <Resume />}
                </div>
            </div>
        </div>
    );
};

export default Profile;