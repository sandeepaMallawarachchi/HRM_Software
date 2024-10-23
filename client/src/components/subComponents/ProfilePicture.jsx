import React, { useEffect, useState } from 'react';
import axios from 'axios';
import defaultAvatar from '../../images/avatar.png';

const ProfilePicture = () => {
    const [avatar, setAvatar] = useState(defaultAvatar);
    const empId = localStorage.getItem("empId");

    useEffect(() => {
        const fetchProfilePic = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/employees/getProfileImage/${empId}`);
                if (response.data.imageUrl) {
                    setAvatar(response.data.imageUrl);
                    console.log(response.data.imageUrl)
                }
            } catch (err) {
                console.log("Error fetching employee profile pic:", err);
            }
        };

        fetchProfilePic();
    }, [empId]);

    return (
        <div>
            <img
                src={avatar}
                alt="avatar"
                className="rounded-full border border-gray-300"
            />
        </div>
    );
}

export default ProfilePicture;