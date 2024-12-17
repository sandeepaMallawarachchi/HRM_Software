import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaLink } from 'react-icons/fa';

const MyFinancialRequests = () => {
    const empId = localStorage.getItem('empId');
    const [financialRequestList, setFinancialRequestList] = useState([]);
    const [filteredFinancialRequestList, setFilteredFinancialRequestList] = useState([]);
    const [yearFilter, setYearFilter] = useState('');
    const [monthFilter, setMonthFilter] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requestResponse = await axios.get(`http://localhost:4000/employees/getFinancialRequests/${empId}`);
                setFinancialRequestList(requestResponse.data);
                setFilteredFinancialRequestList(requestResponse.data);
            } catch (err) {
                console.log("Error fetching data:", err);
            }
        };
        fetchData();
    }, [empId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA');
    };

    const handleFilterChange = () => {
        const filteredList = financialRequestList.filter((financial) => {
            const requestDate = new Date(financial.date_of_request);
            const requestYear = requestDate.getFullYear();
            const requestMonth = requestDate.getMonth() + 1;

            const matchesYear = yearFilter ? requestYear === parseInt(yearFilter) : true;
            const matchesMonth = monthFilter ? requestMonth === parseInt(monthFilter) : true;

            return matchesYear && matchesMonth;
        });
        setFilteredFinancialRequestList(filteredList);
    };

    useEffect(() => {
        handleFilterChange();
    }, [yearFilter, monthFilter, financialRequestList]);

    return (
        <div className="p-6 px-20 bg-[#eaeaea] rounded-lg shadow-md">
            {/* Filters */}
            <div className="flex space-x-4 mt-5">
                <div>
                    <label className="block text-gray-700">Filter by Year</label>
                    <select
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="border-none rounded-md p-2 w-full"
                    >
                        <option value="">All Years</option>
                        {[...new Set(financialRequestList.map(financial => new Date(financial.date_of_request).getFullYear()))]
                            .sort((a, b) => b - a)
                            .map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))
                        }
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700">Filter by Month</label>
                    <select
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(e.target.value)}
                        className="border-none rounded-md p-2 w-full"
                    >
                        <option value="">All Months</option>
                        {Array.from({ length: 12 }, (_, index) => (
                            <option key={index + 1} value={index + 1}>
                                {new Date(0, index).toLocaleString('en-US', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Previous Financial Requests */}
            <div className="mt-10">
                <h3 className="text-lg mb-4">Previous Financial Requests</h3>
                <table className="min-w-full bg-white border text-gray-600 rounded-lg">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Date of Request</th>
                            <th className="py-2 px-4 border-b">Request Type</th>
                            <th className="py-2 px-4 border-b">Amount Requested</th>
                            <th className="py-2 px-4 border-b">Repayment Terms</th>
                            <th className="py-2 px-4 border-b">Reason for Request</th>
                            <th className="py-2 px-4 border-b">Attachment</th>
                            <th className="py-2 px-4 border-b">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {filteredFinancialRequestList.length > 0 ? (
                            filteredFinancialRequestList.map((financial, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-4 border-b">{formatDate(financial.date_of_request)}</td>
                                    <td className="py-2 px-4 border-b">{financial.request_type}</td>
                                    <td className="py-2 px-4 border-b">{financial.amount}</td>
                                    <td className="py-2 px-4 border-b">{financial.repayment_terms}</td>
                                    <td className="py-2 px-4 border-b">{financial.reason}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        {financial.attachment ? (
                                            <a
                                                href={financial.attachment}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex justify-center items-center text-orange-500 hover:text-orange-700"
                                            >
                                                <FaLink size={20} />
                                            </a>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b">{financial.status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-4">No financial requests found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyFinancialRequests;