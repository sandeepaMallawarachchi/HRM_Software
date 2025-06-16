import React, { useState } from 'react';
import axios from 'axios';

const LeaveRequest = () => {
    const empId = localStorage.getItem('empId');
    const [leaveData, setLeaveData] = useState({
        leaveType: '',
        dateFrom: '',
        dateTo: '',
        timeFrom: '',
        timeTo: '',
        description: '',
    });
    const [errors, setErrors] = useState({});

    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    // Real-time validation on form fields
    const validateField = (name, value) => {
        let newErrors = { ...errors };

        if (name === 'dateFrom') {
            if (!value || value < today) {
                newErrors.dateFrom = "Date From cannot be in the past or empty.";
            } else {
                delete newErrors.dateFrom;
            }

            // Re-validate dateTo since dateFrom changed
            if (leaveData.dateTo && leaveData.dateTo < value) {
                newErrors.dateTo = "Date To must be equal to or later than Date From.";
            } else {
                delete newErrors.dateTo;
            }
        }

        if (name === 'dateTo') {
            if (!value || value < leaveData.dateFrom) {
                newErrors.dateTo = "Date To must be equal to or later than Date From.";
            } else {
                delete newErrors.dateTo;
            }
        }

        if (name === 'timeFrom' || name === 'timeTo') {
            if (leaveData.dateFrom === leaveData.dateTo && leaveData.timeFrom && leaveData.timeTo) {
                if (leaveData.timeTo < leaveData.timeFrom) {
                    newErrors.timeTo = "Time To cannot be earlier than Time From on the same day.";
                } else {
                    delete newErrors.timeTo;
                }
            }
        }

        setErrors(newErrors);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLeaveData(prevState => ({
            ...prevState,
            [name]: value,
        }));

        // Trigger validation for each field when it's updated
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Perform final validation before submitting
        if (Object.keys(errors).length > 0 || !leaveData.dateFrom || !leaveData.dateTo) {
            alert('Please fix the errors before submitting.');
            return;
        }

        const newLeaveRequest = {
            empId,
            leave_type: leaveData.leaveType,
            date_from: leaveData.dateFrom,
            date_to: leaveData.dateTo,
            time_from: leaveData.timeFrom,
            time_to: leaveData.timeTo,
            description: leaveData.description,
            status: 'Pending',  // Default status
        };

        try {
            await axios.post(`https://global-hrm-mobile-server.vercel.app/employees/requestLeave/${empId}`, newLeaveRequest);
            setLeaveData({
                leaveType: '',
                dateFrom: '',
                dateTo: '',
                timeFrom: '',
                timeTo: '',
                description: '',
            });
            alert('Leave request submitted successfully!');
        } catch (error) {
            console.error('Error submitting leave request:', error);
            alert('Failed to submit leave request.');
        }
    };

    return (
        <div className="p-6 px-20 bg-[#eaeaea] rounded-lg shadow-md mt-10">
            <h2 className="text-xl mb-6">Submit Leave Request</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label className="block text-gray-700">Leave Type</label>
                    <select
                        name="leaveType"
                        value={leaveData.leaveType}
                        onChange={handleChange}
                        className="border-none rounded-md p-2 w-full"
                        required
                    >
                        <option value="">Select Leave Type</option>
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Vacation/Annual Leave">Vacation/Annual Leave</option>
                        <option value="Personal Leave">Personal Leave</option>
                        <option value="Parental Leave">Parental Leave</option>
                        <option value="Bereavement Leave">Bereavement Leave</option>
                        <option value="Unpaid Leave">Unpaid Leave</option>
                        <option value="Study/Education Leave">Study/Education Leave</option>
                        <option value="Family and Medical Leave">Family and Medical Leave</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700">Date From</label>
                        <input
                            type="date"
                            name="dateFrom"
                            value={leaveData.dateFrom}
                            onChange={handleChange}
                            className={`border-none rounded-md p-2 w-full ${errors.dateFrom ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.dateFrom && <p className="text-red-500 text-sm">{errors.dateFrom}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700">Date To</label>
                        <input
                            type="date"
                            name="dateTo"
                            value={leaveData.dateTo}
                            onChange={handleChange}
                            className={`border-none rounded-md p-2 w-full ${errors.dateTo ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.dateTo && <p className="text-red-500 text-sm">{errors.dateTo}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700">Time From</label>
                        <input
                            type="time"
                            name="timeFrom"
                            value={leaveData.timeFrom}
                            onChange={handleChange}
                            className="border-none rounded-md p-2 w-full"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Time To</label>
                        <input
                            type="time"
                            name="timeTo"
                            value={leaveData.timeTo}
                            onChange={handleChange}
                            className={`border-none rounded-md p-2 w-full ${errors.timeTo ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.timeTo && <p className="text-red-500 text-sm">{errors.timeTo}</p>}
                    </div>
                </div>

                <div className="mt-5">
                    <label className="block text-gray-700">Description (Optional)</label>
                    <textarea
                        name="description"
                        value={leaveData.description}
                        onChange={handleChange}
                        className="border-none rounded-md p-2 w-full"
                        placeholder="Describe the reason for your leave"
                        rows="3"
                    />
                </div>

                <div className="mt-5">
                    <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px]"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LeaveRequest;
