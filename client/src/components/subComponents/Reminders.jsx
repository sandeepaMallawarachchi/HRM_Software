import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBookReader, FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Reminders = () => {
    const empId = localStorage.getItem('empId');
    const [learningReminders, setLearningReminders] = useState([]);
    const [otherReminders, setOtherReminders] = useState([]);

    const fetchReminders = async () => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-CA');

        try {
            const learningResponse = await axios.get(`http://localhost:4000/employees/getReminders/${empId}`, {
                params: { date: formattedDate, subject: 'Learning' },
            });
            setLearningReminders(learningResponse.data);

            const otherResponse = await axios.get(`http://localhost:4000/employees/getReminders/${empId}`, {
                params: { date: formattedDate, subject: 'Others' },
            });
            setOtherReminders(otherResponse.data);
        } catch (error) {
            console.log("Error fetching reminders:", error);
        }
    };

    useEffect(() => {
        fetchReminders();
    }, []);

    return (
        <div>
            {learningReminders.length > 0 && (
                <Link to={'/learn'}><div >
                    {learningReminders.map((reminder) => (
                        <div key={reminder.id} className="flex gap-4 mt-3 p-4 bg-gray-100 rounded-xl">
                            <FaBookReader size={20} color='red' />
                            <span>{reminder.reminder}</span>
                        </div>
                    ))}
                </div></Link>
            )}

            {otherReminders.length > 0 && (
                <Link to={'/reminders'}><div>
                    {otherReminders.map((reminder) => (
                        <div key={reminder.id} className="flex gap-4 mt-3 p-4 bg-gray-100 rounded-xl">
                            <FaBell size={20} color='blue' />
                            <span>{reminder.reminder}</span>
                        </div>
                    ))}
                </div></Link>
            )}

            {learningReminders.length === 0 && otherReminders.length === 0 && (
                <div className="text-sm text-gray-500 mt-4">
                    No reminders available for today.
                </div>
            )}
        </div>
    );
}

export default Reminders;