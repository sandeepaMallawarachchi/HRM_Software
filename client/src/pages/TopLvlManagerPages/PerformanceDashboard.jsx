import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { FaUser, FaStar, FaChartLine } from "react-icons/fa";

const PerformanceDashboard = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("Sales");

  // Sample data for performance metrics
  const employeeData = {
    Sales: [
      { name: "Alice Johnson", performance: 85 },
      { name: "Bob Smith", performance: 78 },
      { name: "Charlie Brown", performance: 92 },
    ],
    Marketing: [
      { name: "David Wilson", performance: 80 },
      { name: "Eva Green", performance: 75 },
    ],
    Development: [
      { name: "Frank Miller", performance: 90 },
      { name: "Grace Lee", performance: 88 },
    ],
    HR: [
      { name: "Henry Adams", performance: 70 },
      { name: "Isabella Taylor", performance: 78 },
    ],
  };

  const chartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: `${selectedDepartment} Performance Over Time`,
        data: [75, 80, 78, 90, 85, 92], // Sample data for demonstration
        fill: false,
        borderColor: "#ff7f50",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Performance Trends",
      },
    },
  };

  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Performance Dashboard
      </h2>

      {/* Department Navigation */}
      <div className="flex justify-center mb-6">
        {Object.keys(employeeData).map((department) => (
          <button
            key={department}
            onClick={() => handleDepartmentChange(department)}
            className={`px-4 py-2 mx-2 rounded-lg ${
              selectedDepartment === department
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-800 border border-gray-300"
            }`}
          >
            {department}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaUser className="text-4xl text-orange-500 mr-4" />
          <div>
            <h3 className="text-xl font-semibold">Total Employees</h3>
            <p className="text-gray-700">
              {employeeData[selectedDepartment].length}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaStar className="text-4xl text-orange-500 mr-4" />
          <div>
            <h3 className="text-xl font-semibold">Top Performer</h3>
            <p className="text-gray-700">
              {
                employeeData[selectedDepartment].reduce((prev, current) =>
                  prev.performance > current.performance ? prev : current
                ).name
              }
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaChartLine className="text-4xl text-orange-500 mr-4" />
          <div>
            <h3 className="text-xl font-semibold">Average Performance</h3>
            <p className="text-gray-700">
              {(
                employeeData[selectedDepartment].reduce(
                  (acc, emp) => acc + emp.performance,
                  0
                ) / employeeData[selectedDepartment].length
              ).toFixed(2)}
              %
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Performance Trends</h3>
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Employee Performance</h3>
        <table className="min-w-full bg-white rounded-lg border border-gray-300">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="border border-gray-300 px-4 py-2">
                Employee Name
              </th>
              <th className="border border-gray-300 px-4 py-2">
                Performance (%)
              </th>
            </tr>
          </thead>
          <tbody>
            {employeeData[selectedDepartment].map((employee, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 transition duration-200"
              >
                <td className="border border-gray-300 px-4 py-2">
                  {employee.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {employee.performance}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
