import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyAttendance = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [filteredAttendanceRecords, setFilteredAttendanceRecords] = useState([]);
    const [yearFilter, setYearFilter] = useState('');
    const [monthFilter, setMonthFilter] = useState('');
    const empId = localStorage.getItem('empId');

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/employees/getAttendance/${empId}`);
                setAttendanceRecords(response.data);
                setFilteredAttendanceRecords(response.data);
            } catch (error) {
                console.error('Error fetching attendance:', error);
            }
        };
        fetchAttendance();
    }, [empId]);

    // Handle filter changes
    const handleFilterChange = () => {
        const filteredList = attendanceRecords.filter((record) => {
            const punchInDate = new Date(record.punch_in_date);
            const recordYear = punchInDate.getFullYear();
            const recordMonth = punchInDate.getMonth() + 1;

            const matchesYear = yearFilter ? recordYear === parseInt(yearFilter) : true;
            const matchesMonth = monthFilter ? recordMonth === parseInt(monthFilter) : true;

            return matchesYear && matchesMonth;
        });
        setFilteredAttendanceRecords(filteredList);
    };

    useEffect(() => {
        handleFilterChange();
    }, [yearFilter, monthFilter, attendanceRecords]);

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
                        {[...new Set(attendanceRecords.map(record => new Date(record.punch_in_date).getFullYear()))]
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

            {/* Attendance Records */}
            <h3 className="text-lg mb-4 mt-6">Attendance Records</h3>
            <table className="min-w-full bg-white border text-gray-600 rounded-lg">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Date</th>
                        <th className="py-2 px-4 border-b">Punch In</th>
                        <th className="py-2 px-4 border-b">Punch Out</th>
                        <th className="py-2 px-4 border-b">Worked Hours</th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {filteredAttendanceRecords.length > 0 ? (
                        filteredAttendanceRecords.map((record, index) => (
                            <tr key={index}>
                                <td className="py-2 px-4 border-b">{new Date(record.punch_in_date).toLocaleDateString()}</td>
                                <td className="py-2 px-4 border-b">{record.punch_in_time}</td>
                                <td className="py-2 px-4 border-b">{record.punch_out_time || 'N/A'}</td>
                                <td className="py-2 px-4 border-b">{record.worked_hours !== 'N/A' ? `${record.worked_hours} hrs` : 'N/A'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center py-4">No attendance records found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MyAttendance;