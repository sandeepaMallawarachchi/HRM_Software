import React, { useEffect, useState } from 'react';
import axios from 'axios';
import defaultAvatar from '../../images/avatar.png';

const ProfilePicture = () => {
    const [avatar, setAvatar] = useState(defaultAvatar);
    const empId = localStorage.getItem("empId");

    useEffect(() => {
        const fetchProfilePic = async () => {

            try {
                const response = await axios.get(`http://localhost:4000/employees/getPersonalDetails/${empId}`);

                if (response.data.profilepic) {
                    setAvatar(`http://localhost:4000${response.data.profilepic}`);
                }

            } catch (err) {
                console.log("Error fetching employee profile pic:", err);
            }
        };

        fetchProfilePic();
    }, []);

    return (
        <div>
            <img
                src={avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full border border-gray-300"
            />
        </div>
    )
}

export default ProfilePicture