import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaBookReader, FaBell } from 'react-icons/fa';

const ReminderPage = () => {
    const empId = localStorage.getItem('empId');
    const [date, setDate] = useState(new Date());
    const [reminder, setReminder] = useState('');
    const [subject, setSubject] = useState('Others');
    const [reminders, setReminders] = useState([]);

    const fetchReminders = async (selectedDate) => {
        try {
            const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 10);

            const response = await axios.get(`http://localhost:4000/employees/getAllReminders/${empId}`, {
                params: { date: localDate },
            });
            setReminders(response.data);
        } catch (error) {
            console.error("Error fetching reminders:", error);
        }
    };

    useEffect(() => {
        fetchReminders(date);
    }, [date]);

    const handleAddReminder = async () => {
        if (reminder.trim()) {
            try {
                const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                    .toISOString()
                    .slice(0, 10);
                await axios.post(`http://localhost:4000/employees/addReminders/${empId}`, {
                    date: localDate,
                    reminder,
                    subject,
                });
                setReminder('');
                fetchReminders(date);
            } catch (error) {
                console.error("Error adding reminder:", error);
            }
        }
    };

    return (
        <div className="m-10 p-6 px-20 bg-[#eaeaea] rounded-lg shadow-md">
            <Calendar onChange={setDate} value={date} />
            <div className="my-8 flex gap-3">
                <input
                    type="text"
                    placeholder="Add a reminder"
                    value={reminder}
                    onChange={(e) => setReminder(e.target.value)}
                    className="p-2 rounded bg-white text-gray-800 w-full"
                />
                <button
                    onClick={handleAddReminder}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-5 w-40"
                >
                    Add Reminder
                </button>
            </div>
            <div className="mt-4">
                {reminders.length > 0 ? (
                    reminders.map((reminder) => (
                        <div key={reminder.id} className="text-left bg-gray-100 rounded-xl p-4 mt-3">
                            <div className="flex gap-4">
                                {reminder.subject === 'Learning' ? (
                                    <FaBookReader size={20} color='red' />
                                ) : (
                                    <FaBell size={20} color='blue' />
                                )}
                                {reminder.reminder}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-sm text-gray-500 mt-4">No reminders available</div>
                )}
            </div>
        </div>
    );
};

export default ReminderPage;