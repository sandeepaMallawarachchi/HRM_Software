import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const LeaveAnalysis = () => {
  const empId = localStorage.getItem('empId');
  const [leaveAnalysis, setLeaveAnalysis] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaveAnalysis = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/employees/leaveAnalysis/${empId}`);
        setLeaveAnalysis(response.data);
      } catch (error) {
        setError('Error fetching leave analysis');
      }
    };

    fetchLeaveAnalysis();
  }, [empId]);

  // Prepare data for the Bar and Pie charts
  const leaveTypes = leaveAnalysis.map(leave => leave.leave_type);
  const totalDays = leaveAnalysis.map(leave => leave.total_days);
  const totalLeaves = leaveAnalysis.map(leave => leave.total_leaves);

  const barData = {
    labels: leaveTypes,
    datasets: [
      {
        label: 'Total Days',
        data: totalDays,
        backgroundColor: '#fa7c10',
        borderColor: '#fa7c10',
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: leaveTypes,
    datasets: [
      {
        label: 'Total Leaves',
        data: totalLeaves,
        backgroundColor: [
          '#fa7c10',    // Orange
          'rgba(54, 162, 235)',   // Blue
          'rgba(75, 192, 192)',   // Green
          'rgba(255, 99, 132)',   // Red
          'rgba(255, 206, 86)',   // Yellow
          'rgba(255, 105, 180)',  // Pink
          'rgba(153, 102, 255)'   // Purple
        ],
      },
    ],
  };

  return (
    <div className="p-6 px-20 bg-[#eaeaea] rounded-lg shadow-md mt-10">
      <h2 className="text-xl mb-6">Leave Analysis</h2>
      {error && <p className="text-red-500">{error}</p>}

      {leaveAnalysis.length > 0 ? (
        <>
          {/* Table */}
          <table className="min-w-full bg-white border text-gray-600 rounded-lg mb-10">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Leave Type</th>
                <th className="py-2 px-4 border-b">Total Leaves</th>
                <th className="py-2 px-4 border-b">Total Days</th>
                <th className="py-2 px-4 border-b">Total Hours</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {leaveAnalysis.map((leave, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">{leave.leave_type}</td>
                  <td className="py-2 px-4 border-b">{leave.total_leaves}</td>
                  <td className="py-2 px-4 border-b">{leave.total_days}</td>
                  <td className="py-2 px-4 border-b">{leave.total_hours}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="grid grid-cols-2 gap-4">
            {/* Bar Graph */}
            <div className="p-6 px-20 bg-[#eaeaea] rounded-lg shadow-md mt-10">
              <h3 className="text-lg mb-4">Leave Types and Total Days</h3>
              <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            </div>

            {/* Pie Chart */}
            <div className="p-6 px-20 bg-[#eaeaea] rounded-lg shadow-md mt-10">
              <h3 className="text-lg mb-4">Leave Types Breakdown</h3>
              <Pie data={pieData} options={{ responsive: true }} />
            </div>
          </div>
        </>
      ) : (
        <p>No leave data found.</p>
      )}
    </div>
  );
};

export default LeaveAnalysis;
