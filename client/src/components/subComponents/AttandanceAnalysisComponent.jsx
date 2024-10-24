import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AttandanceAnalysisComponent = () => {

    const empId = localStorage.getItem('empId');
    const [attendanceAnalysis, setAttendanceAnalysis] = useState({ weekData: [], monthData: [] });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAttendanceAnalysis = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/employees/attendanceAnalysis/${empId}`);
                const { weekData, monthData } = response.data;
                setAttendanceAnalysis({ weekData, monthData });
            } catch (error) {
                setError('Error fetching attendance analysis');
            }
        };

        fetchAttendanceAnalysis();
    }, [empId]);

    const daysOfWeek = attendanceAnalysis.weekData.map(record => record.dayOfWeek);
    const workedHoursInWeek = attendanceAnalysis.weekData.map(record => record.workedHours);

    const barData = {
        labels: daysOfWeek,
        datasets: [
            {
                label: 'Worked Hours in Week',
                data: workedHoursInWeek,
                backgroundColor: '#ef7000',
                borderColor: '#ef7000',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            {error && <p className="text-red-500">{error}</p>}
            {attendanceAnalysis.weekData.length > 0 ? (
                <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            ) : (
                <p className='text-gray-500 text-center'>No attendance data found.</p>
            )}
        </div>
    )
}

export default AttandanceAnalysisComponent