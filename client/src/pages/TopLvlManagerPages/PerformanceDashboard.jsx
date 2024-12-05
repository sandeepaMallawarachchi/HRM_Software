import axios from "axios";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { FaUser, FaStar, FaChartLine } from "react-icons/fa";

const PerformanceDashboard = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("IT (Information Technology)");
  const [empData, setEmpData] = useState({});
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchEmpData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/admin/getEmployeeStats/${selectedDepartment}`);
        setEmpData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:4000/admin/getAllDepartments");
        setDepartments(response.data.map((dept) => dept.department));
      } catch (error) {
        console.error(error);
      }
    };

    fetchEmpData();
    fetchDepartments();
  }, [selectedDepartment]);

  const chartData = {
    labels: empData.monthlyAvgPerformance?.map((item) => item.month) || [],
    datasets: [
      {
        label: `${selectedDepartment} Performance Over Time`,
        data: empData.monthlyAvgPerformance?.map((item) => item.avgPerformance) || [],
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

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Performance Dashboard
      </h2>
      <div className="grid grid-cols-6 gap-2 justify-center mb-6">
        {departments.map((department) => (
          <button
            key={department}
            onClick={() => setSelectedDepartment(department)}
            className={`px-4 py-2 rounded-lg ${selectedDepartment === department
              ? "bg-orange-500 text-white"
              : "bg-white text-gray-800 border border-gray-300 hover:bg-orange-100"
              }`}
          >
            {department}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-4 mb-6 w-full">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center w-full">
          <FaUser className="text-4xl text-orange-500 mr-4" />
          <div>
            <h3 className="text-xl font-semibold">Total Employees</h3>
            <p className="text-gray-700">{empData.employeeCount || 0}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center w-full">
          <FaStar className="text-4xl text-orange-500 mr-4" />
          <div>
            <h3 className="text-xl font-semibold">Top Performer</h3>
            <p className="text-gray-700">
              {empData.topPerformer ? `${empData.topPerformer.name}` : "N/A"}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center w-full">
          <FaChartLine className="text-4xl text-orange-500 mr-4" />
          <div>
            <h3 className="text-xl font-semibold">Average Performance</h3>
            <p className="text-gray-700">
              {empData.monthlyAvgPerformance?.[0]?.avgPerformance || "N/A"} %
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
              <th className="border border-gray-300 px-4 py-2">Employee Name</th>
              <th className="border border-gray-300 px-4 py-2">Performance (%)</th>
            </tr>
          </thead>
          <tbody>
            {empData.employeePerformance?.map((employee, index) => (
              <tr key={index} className="hover:bg-gray-100 transition duration-200">
                <td className="border border-gray-300 px-4 py-2">{employee.name}</td>
                <td className="border border-gray-300 px-4 py-2">{employee.performance}%</td>
              </tr>
            )) || (
                <tr>
                  <td colSpan="2" className="border border-gray-300 px-4 py-2 text-center">No employees data available</td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceDashboard;