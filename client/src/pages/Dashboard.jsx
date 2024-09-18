import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register the necessary Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    // Data for the bar chart (Time at Work)
    const barData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Hours Worked',
                data: [5, 6, 7, 5, 8, 0, 0],
                backgroundColor: '#fa7c10',
            },
        ],
    };

    // Data for the pie charts
    const pieData = {
        labels: ['HR', 'Engineering', 'Marketing', 'Finance'],
        datasets: [
            {
                label: 'Employees by Department',
                data: [12, 19, 8, 5],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            },
        ],
    };

    const pieOptions = {
        maintainAspectRatio: false,
    };

    return (
        <div className="grid grid-cols-3 gap-6 p-6 pt-20"> {/* Added pt-20 to account for the header height */}
            {/* Time at Work Card */}
            <div className="col-span-1 bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Time at Work</h2>
                <div className="flex items-center space-x-3">
                    <div className="bg-gray-300 rounded-full w-12 h-12"></div>
                    <div className="flex-1">
                        <p className="text-orange-600 font-semibold">Not Punched In</p>
                        <p className="text-sm">No hours recorded</p>
                    </div>
                </div>
                <Bar data={barData} />
            </div>

            {/* My Actions Card */}
            <div className="col-span-1 bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">My Actions</h2>
                <div className="text-center">
                    <p className="text-gray-500">No Pending Actions to Perform</p>
                </div>
            </div>

            {/* Quick Launch Card */}
            <div className="col-span-1 bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Quick Launch</h2>
                <div className="text-center">
                    <p className="text-gray-500">Not Available</p>
                </div>
            </div>

            {/* Buzz Latest Posts */}
            <div className="col-span-1 bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Buzz Latest Posts</h2>
                <div className="text-center">
                    <p className="text-gray-500">No posts available</p>
                </div>
            </div>

            {/* Employees on Leave Today */}
            <div className="col-span-1 bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Employees on Leave Today</h2>
                <div className="text-center">
                    <p className="text-gray-500">No employees on leave</p>
                </div>
            </div>

            {/* Employee Distribution by Sub Unit (Pie Chart) */}
            <div className="col-span-1 bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Employee Distribution by Sub Unit</h2>
                <div className="relative w-full h-64">
                    <Pie data={pieData} options={pieOptions} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;