import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBookReader, FaBell, FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Reminders = () => {
    const empId = localStorage.getItem('empId');
    const [learningReminders, setLearningReminders] = useState([]);
    const [otherReminders, setOtherReminders] = useState([]);
    const [trainingReminders, setTrainingReminders] = useState([]);
    const [alerts, setAlerts] = useState([]);

    const fetchReminders = async () => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-CA');

        try {
            const learningResponse = await axios.get(`https://global-hrm-mobile-server.vercel.app/employees/getReminders/${empId}`, {
                params: { date: formattedDate, subject: 'Learning' },
            });
            setLearningReminders(learningResponse.data);

            const otherResponse = await axios.get(`https://global-hrm-mobile-server.vercel.app/employees/getReminders/${empId}`, {
                params: { date: formattedDate, subject: 'Others' },
            });
            setOtherReminders(otherResponse.data);

            const response = await axios.get(`https://global-hrm-mobile-server.vercel.app/admin/getAllocatedResources/${empId}`);
            setAlerts(response.data.filter((alert) => alert.alert === 1));

            const trainingReminders = await axios.get(`https://global-hrm-mobile-server.vercel.app/admin/getTrainingReminder/${empId}`);
            setTrainingReminders(trainingReminders.data);
        } catch (error) {
            console.log("Error fetching reminders:", error);
        }
    };

    useEffect(() => {
        fetchReminders();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA');
    };

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

            {trainingReminders.length > 0 && (
                <Link to={'/learn'}><div>
                    {trainingReminders.map((reminder) => (
                        <div key={reminder.id} className="flex gap-4 mt-3 p-4 bg-gray-100 rounded-xl">
                            <FaBell size={20} color='orange' />
                            <span>{reminder.training}</span>
                        </div>
                    ))}
                </div></Link>
            )}

            {alerts.length > 0 && (
                <div>
                    {alerts.map((alert) => (
                        <div
                            key={alert.id}
                            className="flex gap-4 my-2 p-4 rounded-xl bg-red-200"
                        >
                            <FaExclamationTriangle size={20} color="red" className="self-center" />
                            <span className='text-left'>
                                {alert.resource} allocated to you is delayed. <br />
                                Return date: {formatDate(alert.returneddate)}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {learningReminders.length === 0 && otherReminders.length === 0 && alerts.length === 0 && (
                <div className="text-sm text-gray-500 mt-4">
                    No reminders available for today.
                </div>
            )}
        </div>
    );
}

export default Reminders;