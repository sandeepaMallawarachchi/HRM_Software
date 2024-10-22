import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyAttendance = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const empId = localStorage.getItem('empId');

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/employees/getAttendance/${empId}`);
                setAttendanceRecords(response.data);
            } catch (error) {
                console.error('Error fetching attendance:', error);
            }
        };
        fetchAttendance();
    }, [empId]);

    return (
        <div className="p-6 px-20 bg-[#eaeaea] rounded-lg shadow-md">
            <h3 className="text-lg mb-4">Attendance Records</h3>
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
                    {attendanceRecords.length > 0 ? (
                        attendanceRecords.map((record, index) => (
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
