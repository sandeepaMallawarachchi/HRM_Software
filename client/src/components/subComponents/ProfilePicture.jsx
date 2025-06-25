import React, { useEffect, useState } from 'react';
import axios from 'axios';
import defaultAvatar from '../../images/avatar.png';

const ProfilePicture = () => {
    const [avatar, setAvatar] = useState(defaultAvatar);
    const empId = localStorage.getItem("empId");

    useEffect(() => {
        const fetchProfilePic = async () => {
            try {
                const response = await axios.get(`https://global-hrm-mobile-server.vercel.app/employees/getProfileImage/${empId}`);
                if (response.data.imageUrl) {
                    setAvatar(response.data.imageUrl);
                }
            } catch (err) {
                console.log("Error fetching employee profile pic:", err);
            }
        };

        fetchProfilePic();
    }, [empId]);

    return (
        <div className="rounded-full overflow-hidden border-1 border-white shadow-md">
            <img
                src={avatar}
                alt="avatar"
                className="w-full h-full object-cover"
            />
        </div>
    );
}

export default ProfilePicture;