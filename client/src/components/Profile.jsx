import React, { useEffect, useState } from 'react';
import axios from 'axios';
import defaultAvatar from '../images/avatar.png';
import AccountSecurity from './profileComponents/AccountSecurity';
import PersonalDetails from './profileComponents/PersonalDetails';
import WorkInformation from './profileComponents/WorkInformation';
import Resume from './profileComponents/Resume';
import { FaCamera } from 'react-icons/fa';

const Profile = () => {
    const [visibleSection, setVisibleSection] = useState('account');
    const [avatar, setAvatar] = useState(defaultAvatar);
    const [isHovered, setIsHovered] = useState(false);
    const [empDetails, setEmpDetails] = useState({});
    const [workDetails, setWorkDetails] = useState({});
    const id = 1;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const employeeResponse = await axios.get(`http://localhost:4000/employees/getEmployee/${id}`);
                setEmpDetails(employeeResponse.data);

                const profilePic = employeeResponse.data.profilepic;
                setAvatar(profilePic ? `http://localhost:4000${profilePic}` : defaultAvatar);

                const workResponse = await axios.get(`http://localhost:4000/employees/getWorkDetails/${id}`);
                setWorkDetails(workResponse.data);
            } catch (err) {
                console.log("Error fetching data:", err);
            }
        };

        fetchData();
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('profileImage', file);
            try {
                const response = await axios.post(`http://localhost:4000/employees/uploadProfileImage/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log(response.data); // Log the entire response to check structure
                if (response.data.imageUrl) {
                    setAvatar(`http://localhost:4000${response.data.imageUrl}`); // Update this line
                } else {
                    console.log('Image URL not found in response');
                }
            } catch (err) {
                console.log('Error uploading profile image:', err);
            }
        }
    };

    const handleSectionToggle = (section) => {
        setVisibleSection(visibleSection === section ? null : section);
    };

    return (
        <div className="p-6 h-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-6">
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
                                        <FaCamera />
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

                    <div className="grid grid-cols-1 gap-5 pl-5">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700">{empDetails.username}</h2>
                            <p className="text-sm text-gray-500">{workDetails.designation}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Supervisor</p>
                            <p className="text-sm text-gray-700">{workDetails.supervisor}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Work Email</p>
                            <p className="text-sm text-gray-700">{workDetails.workEmail}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Work Phone</p>
                            <p className="text-sm text-gray-700">{workDetails.workPhone}</p>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-4">
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
