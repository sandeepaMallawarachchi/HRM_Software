import React, { useState } from "react";
import {
  FaDownload,
  FaRegChartBar,
  FaFilter,
  FaChartLine,
  FaEnvelope,
  FaUserTie,
  FaBuilding,
} from "react-icons/fa";

// Sample data for team members
const data = [
  { id: 1, teamMember: "John Doe", performance: "85%", tasksCompleted: 120 },
  { id: 2, teamMember: "Jane Smith", performance: "90%", tasksCompleted: 130 },
  // Add more sample team data here
];

const Reporting = () => {
  const [reportData] = useState(data);
  const [filteredData, setFilteredData] = useState(reportData);
  const [filter, setFilter] = useState("");

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    if (value === "") {
      setFilteredData(reportData);
    } else {
      const filtered = reportData.filter((item) =>
        item.teamMember.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const handleSendMessage = (teamMember) => {
    alert(`Message sent to ${teamMember}`);
    // Add your message sending logic here, e.g., opening a messaging modal or integrating an email API.
  };

  const sendReportToHR = () => {
    alert("Report sent to HR");
    // Add your report sending logic here (e.g., file upload or email API).
  };

  const sendReportToDepartmentManager = () => {
    alert("Report sent to Department Manager");
    // Add your report sending logic here (e.g., file upload or email API).
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Team Performance Reports</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
          <FaDownload />
          <span>Download Report</span>
        </button>
      </div>

      {/* Filter Section */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Filter by team member..."
          className="border rounded-lg px-4 py-2 w-1/3 focus:ring-2 focus:ring-orange-500"
          value={filter}
          onChange={handleFilterChange}
        />
        <button className="bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-300">
          <FaFilter />
          <span>Filter</span>
        </button>
      </div>

      {/* Performance Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-4 border-b">Team Member</th>
              <th className="p-4 border-b">Performance</th>
              <th className="p-4 border-b">Tasks Completed</th>
              <th className="p-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{item.teamMember}</td>
                <td className="p-4">{item.performance}</td>
                <td className="p-4">{item.tasksCompleted}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleSendMessage(item.teamMember)}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2"
                  >
                    <FaEnvelope />
                    <span>Message</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Graphical Reports */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          Team Performance Over Time
        </h2>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <FaChartLine size={50} className="text-gray-400" />
          <span className="text-gray-400 ml-4">Graph Placeholder</span>
        </div>
      </div>

      {/* Talk to HR and Department Manager Section */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={sendReportToHR}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <FaUserTie />
          <span>Send Report to HR</span>
        </button>
        <button
          onClick={sendReportToDepartmentManager}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 flex items-center gap-2"
        >
          <FaBuilding />
          <span>Send Report to Department Manager</span>
        </button>
      </div>
    </div>
  );
};

export default Reporting;
