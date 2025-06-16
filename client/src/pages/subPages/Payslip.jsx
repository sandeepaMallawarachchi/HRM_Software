import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PayslipComponent from '../../components/subComponents/PayslipComponent';

const Payslip = () => {
    const empId = localStorage.getItem('empId');
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [yearFilter, setYearFilter] = useState('');
    const [monthFilter, setMonthFilter] = useState('');
    const [triggerDownload, setTriggerDownload] = useState(false);

    useEffect(() => {
        const fetchPayslips = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://global-hrm-mobile-server.vercel.app/admin/getPayslip/${empId}`);
                setPayslips(response.data);
            } catch (err) {
                console.error('Error fetching payslips:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPayslips();
    }, [empId]);

    // Set default filters to current year and month
    useEffect(() => {
        const currentDate = new Date();
        setYearFilter(currentDate.getFullYear().toString());
        setMonthFilter((currentDate.getMonth() + 1).toString());
    }, []);

    const isMatchingFilter = (payslip) => {
        if (!payslip) return false;

        const payslipDate = new Date(payslip.date);
        const payYear = payslipDate.getFullYear();
        const payMonth = payslipDate.getMonth() + 1;

        const matchesYear = yearFilter ? payYear === parseInt(yearFilter) : true;
        const matchesMonth = monthFilter ? payMonth === parseInt(monthFilter) : true;

        return matchesYear && matchesMonth;
    };

    const handleDownload = (payslip) => {
        if (isMatchingFilter(payslip)) {
            setTriggerDownload(true);
        }
    };

    // Filter payslips based on the selected year and month
    const filteredPayslips = payslips.filter(isMatchingFilter);

    // Handle the first matching payslip
    const { date, total_days_worked, total_hours_worked, earnings, total_earnings, deductions, total_deductions, net_pay } = filteredPayslips[0] || {};

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA');
    };

    return (
        <div className="p-6 px-20 bg-[#eaeaea] rounded-lg shadow-md relative">
            <div className="absolute top-5 right-5 flex space-x-4">
                <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="border-none rounded-md p-2"
                >
                    <option value="">Select Year</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                </select>
                <select
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="border-none rounded-md p-2"
                >
                    <option value="">Select Month</option>
                    {Array.from({ length: 12 }, (_, index) => (
                        <option key={index + 1} value={index + 1}>
                            {new Date(0, index).toLocaleString('en-US', { month: 'long' })}
                        </option>
                    ))}
                </select>
                <button
                    onClick={() => handleDownload(filteredPayslips[0])}
                    disabled={filteredPayslips.length === 0}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px] disabled:bg-orange-300"
                >
                    Download
                </button>
            </div>

            <div>
                {loading && <p className='text-gray-500'>Loading...</p>}
                {!loading && filteredPayslips.length === 0 && <p className='text-center'>No payslips found for the selected filters</p>}
                {filteredPayslips.length > 0 && (
                    <>
                        <h3 className="text-lg mb-4">Payslip for {formatDate(date)}</h3>
                        <h3 className="text-lg mb-4">Total days worked: <span className="font-bold">{total_days_worked}</span></h3>
                        <h3 className="text-lg mb-4">Total hours worked: <span className="font-bold">{total_hours_worked}</span></h3>

                        <table className="min-w-full bg-white border text-gray-600 rounded-lg">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b border-r" colSpan="2">Description</th>
                                    <th className="py-2 px-4 border-b border-r">Earnings (LKR)</th>
                                    <th className="py-2 px-4 border-b">Deductions (LKR)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(earnings).map((key, index) => (
                                    <tr key={index} className='text-right'>
                                        <td className="py-2 px-12 border-b border-r text-left" colSpan="2">{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                                        <td className="py-2 px-12 border-b border-r">{parseFloat(earnings[key]).toFixed(2)}</td>
                                        <td className="py-2 px-12 border-b"></td>
                                    </tr>
                                ))}
                                {Object.keys(deductions).map((key, index) => (
                                    <tr key={index} className='text-right'>
                                        <td className="py-2 px-12 border-b border-r text-left" colSpan="2">{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                                        <td className="py-2 px-12 border-b border-r"></td>
                                        <td className="py-2 px-12 border-b">{parseFloat(deductions[key]).toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td className="py-2 px-12 border-b font-bold border-r text-left" colSpan="2">Total Earnings</td>
                                    <td className="py-2 px-12 border-b border-r text-right">{total_earnings}</td>
                                    <td className="py-2 px-12 border-b"></td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-12 border-b font-bold border-r text-left" colSpan="2">Total Deductions</td>
                                    <td className="py-2 px-12 border-b border-r"></td>
                                    <td className="py-2 px-12 border-b text-right">{total_deductions}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-12 border-b font-bold border-r text-left" colSpan="2">Net Pay</td>
                                    <td className="py-2 px-12 border-b text-center" colSpan="2">{net_pay}</td>
                                </tr>
                            </tbody>
                        </table>
                    </>
                )}
            </div>

            {triggerDownload && (
                <PayslipComponent
                    payslip={filteredPayslips[0]}
                    onDownloadComplete={() => setTriggerDownload(false)}
                />
            )}
        </div>
    );
};

export default Payslip;