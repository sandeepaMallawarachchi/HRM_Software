import React, { useState } from 'react';
import avatar from '../images/avatar.png';
import AccountManagement from './profileComponents/AccountManagement';
import PersonalDetails from './profileComponents/PersonalDetails';
import WorkInformation from './profileComponents/WorkInformation';

const Profile = () => {
    const [visibleSection, setVisibleSection] = useState('account');

    const handleSectionToggle = (section) => {
        setVisibleSection(visibleSection === section ? null : section);
    };

    return (
        <div className="p-6 h-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Picture */}
                <div className="flex justify-center mt-8">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-orange-500">
                        <img src={avatar} alt="Profile" className="object-cover w-full h-full" />
                    </div>
                </div>

                {/* Profile Info */}
                <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700">Sandeepa Mallawarachchi</h2>
                            <p className="text-sm text-gray-500">Senior Software Engineer</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Supervisor</p>
                            <p className="text-sm text-gray-700">John Doe</p>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        <div>
                            <p className="text-sm text-gray-400">Work Email</p>
                            <p className="text-sm text-gray-700">sandeepa.mallawarachchi@hrm.com</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Work Phone</p>
                            <p className="text-sm text-gray-700">+94 712345678</p>
                        </div>
                    </div>

                    {/* Buttons to toggle sections */}
                    <div className="flex space-x-4 mt-10">
                        <button onClick={() => handleSectionToggle('account')} className="button">
                            Account Management
                        </button>
                        <button onClick={() => handleSectionToggle('personal')} className="button">
                            Personal Details
                        </button>
                        <button onClick={() => handleSectionToggle('work')} className="button">
                            Work Information
                        </button>
                        <button onClick={() => handleSectionToggle('resume')} className="button">
                            Resume
                        </button>
                    </div>

                    {/* Conditional Rendering of Sections */}
                    {visibleSection === 'account' && <AccountManagement />}
                    {visibleSection === 'personal' && <PersonalDetails />}
                    {visibleSection === 'work' && <WorkInformation />}
                    {visibleSection === 'resume' && <div>Resume Section Content</div>} {/* Add your Resume component here */}
                </div>
            </div>
        </div>
    );
};

export default Profile;