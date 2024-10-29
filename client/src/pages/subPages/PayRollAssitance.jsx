import React, { useState } from 'react';
import axios from 'axios';

const PayRollAssitance = () => {
    const [subject, setSubject] = useState('');
    const [isDescriptionRequired, setIsDescriptionRequired] = useState(false);
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const empId = localStorage.getItem('empId');
    const [dateError, setDateError] = useState('');

    const handleSubjectChange = (event) => {
        const selectedValue = event.target.value;
        setSubject(selectedValue);
        setIsDescriptionRequired(selectedValue === 'Other');
    };

    const handleDateChange = async (e) => {
        const selectedDate = e.target.value;
        const currentDate = new Date().toISOString().split('T')[0];

        if (selectedDate > currentDate) {
            setDateError('Future dates are not allowed.');
            setDate('');
            return;
        } else {
            setDateError('');
            setDate(selectedDate);
        }

        try {
            const response = await axios.get(`http://localhost:4000/admin/getPayslip/${empId}`, { params: { date: selectedDate } });

            if (response.data.date === selectedDate) {
                setDate(selectedDate);
            } else {
                setDateError('No payslip found for the selected date.');
                setDate('');
            }
        } catch (error) {
            setDateError('Error checking payslip availability.');
            setDate('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!empId) {
            alert('Employee ID not found. Please log in again.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:4000/employees/payrollAssistance/${empId}`, {
                date,
                subject,
                description: isDescriptionRequired ? description : ''
            });

            alert(response.data.message);
            setDate('');
            setSubject('');
            setDescription('');
        } catch (error) {
            alert('Failed to submit payroll assistance request.');
        }
    };

    return (
        <div className="p-6 px-20 bg-[#eaeaea] rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-gray-500">Date of payslip</label>
                        <input
                            name="date"
                            value={date}
                            onChange={handleDateChange}
                            className="border-none rounded-md p-2 w-full"
                            type="date"
                            required
                        />
                        {dateError && <p className="text-red-500">{dateError}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-500">Subject</label>
                        <select
                            name="subject"
                            className="border-none rounded-md p-2 w-full"
                            value={subject}
                            onChange={handleSubjectChange}
                            required
                        >
                            <option value="">Select Leave Type</option>
                            <option value="Discrepancies in Payments">Discrepancies in Payments</option>
                            <option value="Bonus Disputes">Bonus Disputes</option>
                            <option value="Overtime Issue">Overtime Issue</option>
                            <option value="Incorrect Tax Withholding">Incorrect Tax Withholding</option>
                            <option value="Missing Hours Worked">Missing Hours Worked</option>
                            <option value="Salary Review Request">Salary Review Request</option>
                            <option value="Leave Balances Incorrect">Leave Balances Incorrect</option>
                            <option value="Loan Repayment Deduction Error">Loan Repayment Deduction Error</option>
                            <option value="Other">Other (must fill description)</option>
                        </select>
                    </div>
                </div>

                <div className="mt-5">
                    <label className="block text-gray-700">Description {isDescriptionRequired && "(Required)"}</label>
                    <textarea
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border-none rounded-md p-2 w-full"
                        placeholder="Describe your problem"
                        rows="3"
                        required={isDescriptionRequired}
                    />
                </div>

                <button
                    type="submit"
                    className="w-32 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px] mt-4"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default PayRollAssitance;