import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { FaCheckCircle, FaExclamationCircle, FaRegClock } from "react-icons/fa";

const ComplianceTrack = () => {
  const [selectedComplianceType, setSelectedComplianceType] =
    useState("Regulatory");

  // Sample compliance data
  const complianceData = {
    Regulatory: {
      total: 50,
      compliant: 45,
      nonCompliant: 5,
      deadlines: [
        { name: "Safety Audits", dueDate: "2024-12-01", status: "compliant" },
        {
          name: "Environmental Regulations",
          dueDate: "2024-12-15",
          status: "nonCompliant",
        },
        { name: "Data Protection", dueDate: "2024-11-30", status: "compliant" },
      ],
    },
    Internal: {
      total: 30,
      compliant: 25,
      nonCompliant: 5,
      deadlines: [
        { name: "Policy Updates", dueDate: "2024-10-30", status: "compliant" },
        {
          name: "Training Sessions",
          dueDate: "2024-11-15",
          status: "nonCompliant",
        },
      ],
    },
    Financial: {
      total: 40,
      compliant: 35,
      nonCompliant: 5,
      deadlines: [
        {
          name: "Financial Audits",
          dueDate: "2024-12-20",
          status: "compliant",
        },
        { name: "Tax Filings", dueDate: "2024-11-15", status: "nonCompliant" },
      ],
    },
  };

  const barChartData = {
    labels: ["Compliant", "Non-Compliant"],
    datasets: [
      {
        label: `${selectedComplianceType} Compliance`,
        data: [
          complianceData[selectedComplianceType].compliant,
          complianceData[selectedComplianceType].nonCompliant,
        ],
        backgroundColor: ["#4caf50", "#f44336"],
      },
    ],
  };

  const pieChartData = {
    labels: ["Compliant", "Non-Compliant"],
    datasets: [
      {
        data: [
          complianceData[selectedComplianceType].compliant,
          complianceData[selectedComplianceType].nonCompliant,
        ],
        backgroundColor: ["#4caf50", "#f44336"],
      },
    ],
  };

  const handleComplianceChange = (complianceType) => {
    setSelectedComplianceType(complianceType);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Compliance Tracking Dashboard
      </h2>

      {/* Compliance Type Navigation */}
      <div className="flex justify-center mb-6">
        {Object.keys(complianceData).map((complianceType) => (
          <button
            key={complianceType}
            onClick={() => handleComplianceChange(complianceType)}
            className={`px-4 py-2 mx-2 rounded-lg ${
              selectedComplianceType === complianceType
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-800 border border-gray-300"
            }`}
          >
            {complianceType}
          </button>
        ))}
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaCheckCircle className="text-4xl text-green-500 mr-4" />
          <div>
            <h3 className="text-xl font-semibold">Total Compliance</h3>
            <p className="text-gray-700">
              {complianceData[selectedComplianceType].total}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaExclamationCircle className="text-4xl text-red-500 mr-4" />
          <div>
            <h3 className="text-xl font-semibold">Non-Compliant</h3>
            <p className="text-gray-700">
              {complianceData[selectedComplianceType].nonCompliant}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaRegClock className="text-4xl text-yellow-500 mr-4" />
          <div>
            <h3 className="text-xl font-semibold">Upcoming Deadlines</h3>
            <p className="text-gray-700">
              {complianceData[selectedComplianceType].deadlines.length}
            </p>
          </div>
        </div>
      </div>

      {/* Bar Chart for Compliance Status */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 h-64">
        <h3 className="text-xl font-semibold mb-4">Compliance Status</h3>
        <Bar
          data={barChartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
          height={200}
        />
      </div>

      {/* Pie Chart for Compliance Overview */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 h-48">
        <h3 className="text-xl font-semibold mb-4">Compliance Overview</h3>
        <div className="h-32">
          <Pie
            data={pieChartData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  position: "top",
                },
              },
            }}
            height={200}
          />
        </div>
      </div>

      {/* Compliance Deadlines Overview */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Compliance Deadlines</h3>
        <table className="min-w-full bg-white rounded-lg border border-gray-300">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Task</th>
              <th className="border border-gray-300 px-4 py-2">Due Date</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {complianceData[selectedComplianceType].deadlines.map(
              (deadline, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {deadline.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {deadline.dueDate}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-white ${
                        deadline.status === "compliant"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {deadline.status.charAt(0).toUpperCase() +
                        deadline.status.slice(1)}
                    </span>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplianceTrack;
