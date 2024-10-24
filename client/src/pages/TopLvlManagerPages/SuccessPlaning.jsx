import React, { useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { FaFlagCheckered, FaUserFriends, FaChartPie } from "react-icons/fa";

const SuccessPlanning = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("Sales");

  // Sample success metrics data for different departments
  const successData = {
    Sales: {
      targets: 150,
      achieved: 120,
      teamSize: 10,
      goals: [
        { goal: "Increase Sales by 20%", status: "In Progress" },
        { goal: "Expand to 3 new markets", status: "Not Started" },
      ],
    },
    Marketing: {
      targets: 100,
      achieved: 90,
      teamSize: 8,
      goals: [
        { goal: "Launch new campaign", status: "Completed" },
        { goal: "Increase brand awareness by 30%", status: "In Progress" },
      ],
    },
    Development: {
      targets: 5,
      achieved: 3,
      teamSize: 12,
      goals: [
        { goal: "Release new feature", status: "In Progress" },
        { goal: "Fix critical bugs", status: "Completed" },
      ],
    },
    HR: {
      targets: 10,
      achieved: 8,
      teamSize: 5,
      goals: [
        { goal: "Improve employee satisfaction by 25%", status: "In Progress" },
        { goal: "Reduce turnover rate", status: "Not Started" },
      ],
    },
  };

  const barChartData = {
    labels: ["Targets", "Achieved"],
    datasets: [
      {
        label: `${selectedDepartment} Success`,
        data: [
          successData[selectedDepartment].targets,
          successData[selectedDepartment].achieved,
        ],
        backgroundColor: ["rgba(255, 159, 64, 0.6)", "rgba(75, 192, 192, 0.6)"],
      },
    ],
  };

  const doughnutChartData = {
    labels: ["Team Members", "Remaining Capacity"],
    datasets: [
      {
        data: [
          successData[selectedDepartment].teamSize,
          20 - successData[selectedDepartment].teamSize,
        ],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Success Planning Dashboard
      </h2>

      {/* Department Navigation */}
      <div className="flex justify-center mb-6">
        {Object.keys(successData).map((department) => (
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

      {/* Success Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaFlagCheckered className="text-4xl text-orange-500 mr-4" />
          <div>
            <h3 className="text-xl font-semibold">Targets</h3>
            <p className="text-gray-700">
              {successData[selectedDepartment].targets}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaUserFriends className="text-4xl text-orange-500 mr-4" />
          <div>
            <h3 className="text-xl font-semibold">Achieved</h3>
            <p className="text-gray-700">
              {successData[selectedDepartment].achieved}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaChartPie className="text-4xl text-orange-500 mr-4" />
          <div>
            <h3 className="text-xl font-semibold">Team Size</h3>
            <p className="text-gray-700">
              {successData[selectedDepartment].teamSize}
            </p>
          </div>
        </div>
      </div>

      {/* Smaller Bar Chart for Targets vs Achieved */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 h-64">
        <h3 className="text-xl font-semibold mb-4">Targets vs Achieved</h3>
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
          height={200} // Set the height of the chart
        />
      </div>

      {/* Smaller Doughnut Chart for Team Capacity */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 h-64">
        <h3 className="text-xl font-semibold mb-4">Team Capacity</h3>
        <Doughnut
          data={doughnutChartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
          height={200} // Set the height of the chart
        />
      </div>

      {/* Goals Overview */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Current Goals</h3>
        <table className="min-w-full bg-white rounded-lg border border-gray-300">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Goal</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {successData[selectedDepartment].goals.map((goal, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 transition duration-200"
              >
                <td className="border border-gray-300 px-4 py-2">
                  {goal.goal}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {goal.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuccessPlanning;
