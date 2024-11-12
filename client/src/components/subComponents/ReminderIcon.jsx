import React, { useState, useEffect } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';
import Reminders from './Reminders';
import axios from 'axios';

const ReminderIcon = () => {
    const [showPopUp, setShowPopUp] = useState(false);
    const [reminderCount, setReminderCount] = useState(0);
    const empId = localStorage.getItem('empId');

    const fetchReminderCount = async () => {
        const today = new Date().toISOString().slice(0, 10);
        try {
            const response = await axios.get(`http://localhost:4000/employees/getReminders/${empId}`, {
                params: { date: today },
            });
            setReminderCount(response.data.length); // Set the reminder count
        } catch (error) {
            console.log("Error fetching reminder count:", error);
        }
    };

    const togglePopUp = () => {
        setShowPopUp(!showPopUp);
    };

    const closePopUp = () => {
        setShowPopUp(false);
    };

    useEffect(() => {
        fetchReminderCount();
    }, []);

    return (
        <div className="relative">
            <FaBell
                className="text-white cursor-pointer hover:text-orange-200"
                size={20}
                onClick={togglePopUp}
            />
            {reminderCount > 0 && (
                <div className="absolute -top-2 left-2 bg-red-600 text-white text-xs rounded-full w-5 px-1 py-0.5 text-center">
                    {reminderCount}
                </div>
            )}
            {showPopUp && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg p-4 rounded-lg w-80">
                    <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        onClick={closePopUp}
                    >
                        <FaTimes />
                    </button>
                    <Reminders />
                </div>
            )}
        </div>
    );
};

export default ReminderIcon;