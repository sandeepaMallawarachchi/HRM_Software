import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const PunchInOut = () => {
    const empId = localStorage.getItem('empId');
    const [isPunchedIn, setIsPunchedIn] = useState(false);
    const [punchInTime, setPunchInTime] = useState('');
    const [note, setNote] = useState('');
    const [time, setTime] = useState('');
    const [errors, setErrors] = useState({ time: '' });

    useEffect(() => {
        const storedPunchInData = localStorage.getItem('punchInData');
        if (storedPunchInData) {
            const { time, date } = JSON.parse(storedPunchInData);
            const currentDate = moment().format('YYYY-MM-DD');

            // Check if the stored date is different from the current date
            if (moment(date).isBefore(currentDate, 'day')) {
                localStorage.removeItem('punchInData'); // Clear outdated punch-in data
            } else {
                setIsPunchedIn(true);
                setPunchInTime(time);
            }
        }
    }, []);

    const validatePunchInTime = (selectedTime) => {
        const currentTime = moment().format('HH:mm');
        if (selectedTime < currentTime) {
            setErrors({ time: 'Punch-in time must be equal to or later than the current time' });
        } else {
            setErrors({ time: '' });
        }
    };

    const validatePunchOutTime = (selectedTime) => {
        const currentTime = moment().format('HH:mm');
        if (selectedTime <= punchInTime) {
            setErrors({ time: 'Punch-out time must be later than punch-in time' });
        } else if (selectedTime > currentTime) {
            setErrors({ time: 'Punch-out time must be less than or equal to the current time' });
        } else {
            setErrors({ time: '' });
        }
    };

    const handlePunchIn = async (e) => {
        e.preventDefault();
        if (errors.time) return;
        try {
            const response = await axios.post(`https://global-hrm-mobile-server.vercel.app/employees/attendance/${empId}`, {
                punch_in_time: time,
                note,
            });
            if (response.status === 201 || response.status === 200) {
                const currentDate = moment().format('YYYY-MM-DD');
                setPunchInTime(time);
                setIsPunchedIn(true);
                setTime('');
                localStorage.setItem('punchInData', JSON.stringify({ time, date: currentDate }));
                alert('Punched in successfully');
            }
        } catch (error) {
            console.error('Error punching in:', error);
        }
    };

    const handlePunchOut = async (e) => {
        e.preventDefault();
        if (errors.time || time <= punchInTime) return;
        try {
            const response = await axios.post(`https://global-hrm-mobile-server.vercel.app/employees/attendance/${empId}`, {
                punch_out_time: time,
                note,
            });
            if (response.status === 200) {
                setIsPunchedIn(false);
                setPunchInTime('');
                setTime('');
                localStorage.removeItem('punchInData'); // Clear punch-in data on punch-out
                alert('Punched out successfully');
            }
        } catch (error) {
            console.error('Error punching out:', error);
        }
    };

    return (
        <div className="p-6 px-20 bg-[#eaeaea] rounded-lg shadow-md mt-10">
            <h2 className="text-xl mb-6">
                {isPunchedIn ? 'Submit Punch Out' : 'Submit Punch In'}
            </h2>
            <form onSubmit={isPunchedIn ? handlePunchOut : handlePunchIn}>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-gray-700">Time</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => {
                                setTime(e.target.value);
                                if (!isPunchedIn) {
                                    validatePunchInTime(e.target.value);
                                } else {
                                    validatePunchOutTime(e.target.value);
                                }
                            }}
                            className="border-none rounded-md p-2 w-full"
                            required
                        />
                        {errors.time && <p className="text-red-600 text-sm">{errors.time}</p>}
                    </div>
                </div>

                <div className="mt-5">
                    <label className="block text-gray-700">Note (Optional)</label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="border-none rounded-md p-2 w-full"
                        placeholder="Add your note"
                        rows="3"
                    />
                </div>

                <div className="mt-5">
                    <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px]"
                        disabled={errors.time}
                    >
                        {isPunchedIn ? 'Punch Out' : 'Punch In'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PunchInOut;