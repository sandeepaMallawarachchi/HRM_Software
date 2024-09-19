import React, { useState } from 'react';
import avatar from '../images/avatar.png';
import AccountSecurity from './profileComponents/AccountSecurity';
import PersonalDetails from './profileComponents/PersonalDetails';
import WorkInformation from './profileComponents/WorkInformation';
import Resume from './profileComponents/Resume';

const Profile = () => {
    const [visibleSection, setVisibleSection] = useState('account');

    const handleSectionToggle = (section) => {
        setVisibleSection(visibleSection === section ? null : section);
    };

    return (
        <div className="p-6 h-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Profile Picture, Profile Info, and Contact Info */}
                <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex justify-center mt-8">
                        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-orange-500">
                            <img src={avatar} alt="Profile" className="object-cover w-full h-full" />
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="grid grid-cols-1 gap-5 pl-5">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700">Sandeepa Mallawarachchi</h2>
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