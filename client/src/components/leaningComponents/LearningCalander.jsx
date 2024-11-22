import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../CSS/LearningDevelopment.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

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
            const response = await axios.get(`http://localhost:4000/employees/getReminders/${empId}`, {
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
                await axios.post(`http://localhost:4000/employees/addReminders/${empId}`, {
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
            <h2 className="text-lg font-semibold">Learning Calendar</h2>
            <Calendar onChange={handleDateChange} value={date} />
            <p className="mt-2">Selected Date: {date.toDateString()}</p>
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
                        reminders.map((remind) => (
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