import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../CSS/LearningDevelopment.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Link } from 'react-router-dom'

const LearningCalendar = () => {
    const empId = localStorage.getItem('empId');
    const [date, setDate] = useState(new Date());
    const [reminder, setReminder] = useState("");
    const [reminders, setReminders] = useState([]);

    const formatDateForDB = (selectedDate) => {
        const adjustedDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
        return adjustedDate.toISOString().slice(0, 10);
    };

    const fetchReminders = async (selectedDate) => {
        try {
            const formattedDate = formatDateForDB(selectedDate);
            const response = await axios.get(`https://global-hrm-mobile-server.vercel.app/employees/getReminders/${empId}`, {
                params: { date: formattedDate, subject: "Learning" },
            });
            setReminders(response.data);
        } catch (error) {
            console.log("Error fetching reminders:", error);
        }
    };

    useEffect(() => {
        fetchReminders(date);
    }, [date]);

    const handleDateChange = (selectedDate) => {
        setDate(selectedDate);
        fetchReminders(selectedDate);
    };

    const handleAddReminder = async () => {
        if (reminder.trim()) {
            try {
                const formattedDate = formatDateForDB(date);
                await axios.post(`https://global-hrm-mobile-server.vercel.app/employees/addReminders/${empId}`, {
                    date: formattedDate,
                    reminder,
                    subject: "Learning",
                });
                setReminder("");
                fetchReminders(date);
            } catch (error) {
                console.log("Error adding reminder:", error);
                alert('Error adding reminder');
            }
        }
    };

    return (
        <div className="card bg-gray-100 border border-gray-300 rounded-lg p-5">
            <div className="flex justify-between mb-2">
                <h2 className="text-lg font-semibold mb-2">Learning Calendar</h2>
                <Link
                    to={'/reminders'}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300"
                >
                    View All
                </Link>
            </div>
            <Calendar onChange={handleDateChange} value={date} />
            <div className="mt-4 flex gap-2">
                <input
                    type="text"
                    placeholder="Add a reminder"
                    value={reminder}
                    onChange={(e) => setReminder(e.target.value)}
                    className="p-2 rounded bg-white text-gray-800"
                />
                <button
                    onClick={handleAddReminder}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-2"
                >
                    Add Reminder
                </button>
            </div>
            <div className="mt-4">
                <h3 className="text-md font-semibold">Reminders</h3>
                <ul className="list-disc list-inside ml-5">
                    {reminders.length > 0 ? (
                        reminders
                            .slice(0, 1)
                            .map((remind) => (
                                <li key={remind.id} className="text-sm">
                                    {remind.reminder}
                                </li>
                            ))
                    ) : (
                        <p className="text-sm text-gray-500">No reminders available</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default LearningCalendar;