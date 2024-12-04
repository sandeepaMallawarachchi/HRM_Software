import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaTimes, FaPlusCircle } from 'react-icons/fa';
import Reminders from './Reminders';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReminderIcon = () => {
    const [showPopUp, setShowPopUp] = useState(false);
    const [reminderCount, setReminderCount] = useState(0);
    const [alertsCount, setAlertsCount] = useState(0);
    const navigate = useNavigate('');
    const empId = localStorage.getItem('empId');
    const popUpRef = useRef(null);

    const fetchReminderCount = async () => {
        const today = new Date().toISOString().slice(0, 10);
        try {
            const response = await axios.get(`http://localhost:4000/employees/getAllReminders/${empId}`, {
                params: { date: today },
            });
            setReminderCount(response.data.length);
        } catch (error) {
            console.log("Error fetching reminder count:", error);
        }
    };

    const fetchAlertsCount = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/admin/getAllocatedResources/${empId}`);
            const filteredAlerts = response.data.filter((item) => item.alert === 1);
            setAlertsCount(filteredAlerts.length);
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
        fetchAlertsCount();
    }, []);

    const handleAddingReminder = () => {
        navigate('/reminders');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popUpRef.current && !popUpRef.current.contains(event.target)) {
                setShowPopUp(false);
            }
        };

        if (showPopUp) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPopUp]);

    const totalCount = reminderCount + alertsCount;

    return (
        <div className="relative">
            <FaBell
                className="text-white cursor-pointer hover:text-orange-200"
                size={20}
                onClick={togglePopUp}
            />
            {totalCount > 0 && (
                <div className="absolute -top-2 left-2 bg-red-600 text-white text-xs rounded-full w-5 px-1 py-0.5 text-center">
                    {totalCount}
                </div>
            )}
            {showPopUp && (
                <div ref={popUpRef} className="absolute right-0 mt-2 bg-white shadow-lg p-4 rounded-lg w-80">
                    <div className="flex justify-between">
                        <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={handleAddingReminder}
                        >
                            <FaPlusCircle size={20} />
                        </button>
                        <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={closePopUp}
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>
                    <Reminders />
                </div>
            )}
        </div>
    );
};

export default ReminderIcon;