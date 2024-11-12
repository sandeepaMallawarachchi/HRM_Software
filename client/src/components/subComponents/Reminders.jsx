import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBookReader } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Reminders = () => {
    const empId = localStorage.getItem('empId');
    const [reminders, setReminders] = useState([]);

    const fetchReminders = async () => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-CA');

        try {
            const response = await axios.get(`http://localhost:4000/employees/getReminders/${empId}`, {
                params: { date: formattedDate },
            });
            setReminders(response.data);
        } catch (error) {
            console.log("Error fetching reminders:", error);
        }
    };

    useEffect(() => {
        fetchReminders();
    }, []);

    return (
        <div>
            {reminders.length > 0 ? (
                reminders.map((reminder) => (
                    <Link to='/learn' key={reminder.id}>
                        <div className="text-left bg-gray-100 rounded-xl p-4 mt-3">
                            <div className="flex gap-4">
                                <FaBookReader size={20} color='red' />
                                {reminder.reminder}
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <div className="text-sm text-gray-500 mt-4">
                    No reminders available for today.
                </div>
            )}
        </div>
    );
}

export default Reminders;