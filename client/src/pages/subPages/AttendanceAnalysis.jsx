import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import AttandanceAnalysisComponent from '../../components/subComponents/AttandanceAnalysisComponent';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AttendanceAnalysis = () => {
    const empId = localStorage.getItem('empId');
    const [attendanceAnalysis, setAttendanceAnalysis] = useState({ weekData: [], monthData: [] });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAttendanceAnalysis = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/employees/attendanceAnalysis/${empId}`);
                const { monthData } = response.data;
                setAttendanceAnalysis({ monthData });
            } catch (error) {
                setError('Error fetching attendance analysis');
            }
        };

        fetchAttendanceAnalysis();
    }, [empId]);

    const monthLabels = attendanceAnalysis.monthData.map(record => record.month);
    const workedHoursInMonth = attendanceAnalysis.monthData.map(record => record.workedHours);

    const pieData = {
        labels: monthLabels,
        datasets: [
            {
                label: 'Worked Hours in Month',
                data: workedHoursInMonth,
                backgroundColor: [
                    '#ef7000',  // January
                    '#FF6384',  // February
                    '#36A2EB',  // March
                    '#FFCE56',  // April
                    '#9966FF',  // May
                    '#FF9F40',  // June
                    '#4CAF50',  // July
                    '#FF8C00',  // August
                    '#00BFFF',  // September
                    '#8A2BE2',  // October
                    '#FFD700',  // November
                    '#FF4500'   // December
                ],
            },
        ],
    };

    return (
        <div className="p-6 px-20 bg-[#eaeaea] rounded-lg shadow-md mt-10">
            <h2 className="text-xl mb-6">Attendance Analysis</h2>
            {error && <p className="text-red-500">{error}</p>}

            {attendanceAnalysis.monthData.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 px-20 bg-white rounded-lg shadow-md mt-10">
                        <h3 className="text-lg mb-4">Worked Hours in the Week</h3>
                        <AttandanceAnalysisComponent />
                    </div>

                    <div className="p-6 px-20 bg-white rounded-lg shadow-md mt-10">
                        <h3 className="text-lg mb-4">Worked Hours in the Month</h3>
                        <Pie data={pieData} options={{ responsive: true }} />
                    </div>
                </div>
            ) : (
                <p>No attendance data found.</p>
            )}
        </div>
    );
};

export default AttendanceAnalysis;