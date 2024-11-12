import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SalaryAdvanceLoanRequest = () => {
    const [date_of_request, setDate] = useState('');
    const [request_type, setType] = useState('');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [repayment_terms, setRepaymentTerms] = useState('');
    const [customRepayment, setCustomRepayment] = useState(false);
    const [attachment, setAttachment] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [netPay, setNetPay] = useState('');
    const [error, setError] = useState('');
    const empId = localStorage.getItem('empId');

    const handleRepaymentChange = (e) => {
        const selectedOption = e.target.value;
        setRepaymentTerms(selectedOption);
        setCustomRepayment(selectedOption === 'Other');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!termsAccepted) {
            alert("Please accept the terms and conditions.");
            return;
        }

        if (parseFloat(amount) > parseFloat(netPay)) {
            setError('Requested amount cannot be greater than your net pay for the current month.');
            return;
        }

        const formData = new FormData();
        formData.append('date_of_request', date_of_request);
        formData.append('request_type', request_type);
        formData.append('amount', amount);
        formData.append('reason', reason);
        formData.append('repayment_terms', repayment_terms);
        formData.append('empId', empId);
        if (attachment) formData.append('financialAttachment', attachment);

        try {
            const response = await axios.post(`http://localhost:4000/employees/financialRequest/${empId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert(response.data.message);
            // Reset form after successful submission
            setDate('');
            setType('');
            setAmount('');
            setReason('');
            setRepaymentTerms('');
            setCustomRepayment(false);
            setAttachment(null);
            setTermsAccepted(false);
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('Failed to submit request. Please try again.');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setAttachment(file);
    };

    useEffect(() => {
        const fetchNetPay = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/admin/getPayslip/${empId}`);
                const payslips = response.data;
                const currentDate = new Date();
                const currentMonth = currentDate.getMonth();
                const currentYear = currentDate.getFullYear();

                const currentPayslip = payslips.find(payslip => {
                    const payslipDate = new Date(payslip.date);
                    return payslipDate.getMonth() === currentMonth && payslipDate.getFullYear() === currentYear;
                });

                if (currentPayslip) {
                    setNetPay(currentPayslip.net_pay);
                } else {
                    console.error('Payslip for current month not found.');
                    setNetPay(0);
                }
            } catch (err) {
                console.error('Error fetching payslip:', err);
            }
        };

        fetchNetPay();
    }, [empId]);

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        const today = new Date().toISOString().split('T')[0];
        if (selectedDate > today) {
            alert('Future dates are not allowed.');
            setDate(today);
        } else {
            setDate(selectedDate);
        }
    };

    return (
        <div className="p-6 px-20 bg-[#eaeaea] rounded-lg shadow-md">
            {/* request form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-gray-500">Date of Request</label>
                        <input
                            type="date"
                            value={date_of_request}
                            onChange={handleDateChange}
                            required
                            className="border-none rounded-md p-2 w-full"
                            max={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-gray-500">Request Type</label>
                        <select
                            value={request_type}
                            onChange={(e) => setType(e.target.value)}
                            required
                            className="border-none rounded-md p-2 w-full"
                        >
                            <option value="">Select Type</option>
                            <option value="SalaryAdvance">Salary Advance</option>
                            <option value="Loan">Loan</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1 text-gray-500">Amount Requested</label>
                        <input
                            type="number"
                            min="1"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            className="border-none rounded-md p-2 w-full"
                            placeholder="Enter amount"
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>
                    <div>
                        <label className="block mb-1 text-gray-500">Repayment Terms</label>
                        <select
                            value={repayment_terms}
                            onChange={handleRepaymentChange}
                            className="border-none rounded-md p-2 w-full mb-2"
                            required
                        >
                            <option value="">Select Repayment Terms</option>
                            <option value="Monthly deductions">Monthly deductions</option>
                            <option value="Bi-weekly deductions">Bi-weekly deductions</option>
                            <option value="Lump sum payment">Lump sum payment</option>
                            <option value="Other">Other (specify below)</option>
                        </select>
                        {customRepayment && (
                            <textarea
                                value={repayment_terms}
                                onChange={(e) => setRepaymentTerms(e.target.value)}
                                required
                                className="border-none rounded-md p-2 w-full mt-2"
                                rows="2"
                                placeholder="Specify repayment schedule"
                            ></textarea>
                        )}
                    </div>
                </div>
                <div>
                    <label className="block mb-1 text-gray-500">Reason for Request</label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        className="border-none rounded-md p-2 w-full"
                        rows="3"
                        placeholder="Explain your reason"
                    ></textarea>
                </div>
                <div>
                    <label className="block mb-1 text-gray-500">Attachment (Optional)</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="border-none rounded-md p-2 w-full"
                    />
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={() => setTermsAccepted(!termsAccepted)}
                        required
                        className="mr-2"
                    />
                    <span className="text-gray-600">I agree to the <a href="#" className='underline'>terms and conditions</a></span>
                </div>
                <button
                    type="submit"
                    className="w-32 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px] mt-4"
                >
                    Submit
                </button>
            </form>
        </div >
    );
};

export default SalaryAdvanceLoanRequest;