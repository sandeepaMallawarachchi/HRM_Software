import React, { useEffect, useState } from "react";
import { FaDownload, FaChartLine, FaEnvelope, FaUserTie, FaBuilding } from "react-icons/fa";
import axios from "axios";

const Reporting = () => {
  const [teamData, setTeamData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [filter, setFilter] = useState("");
  const empId = localStorage.getItem("empId");
  const [filteredTeamName, setFilteredTeamName] = useState("");

  const handleTeamNameChange = async (e) => {
    const selectedTeamName = e.target.value;
    setFilteredTeamName(selectedTeamName);

    if (selectedTeamName === "") {
      setFilteredData([]);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:4000/admin/getTeam/${empId}/${selectedTeamName}`);
      setTeamData(response.data);
      setFilteredData(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchTeamsAndData = async () => {
      try {
        const teamsResponse = await axios.get(`http://localhost:4000/admin/getAllTeams/${empId}`);
        setAllTeams(teamsResponse.data);
        setFilteredData(teamsResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTeamsAndData();
  }, []);

  const handlePerformanceChange = (id, value) => {
    setFilteredData((prevData) =>
      prevData.map((item) => (item.id === id ? { ...item, performance: value } : item))
    );
  };

  const handleTasksCompletedChange = (id, value) => {
    setFilteredData((prevData) =>
      prevData.map((item) => (item.id === id ? { ...item, tasksCompleted: value } : item))
    );
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    if (!value) {
      setFilteredData(teamData);
    } else {
      const filtered = teamData.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    }
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
      <div className="flex justify-between mb-4">
        <select
          value={filteredTeamName}
          onChange={handleTeamNameChange}
          className="border rounded-lg px-4 py-2 w-1/3"
        >
          <option value="">Select a Team</option>
          {[...new Set(allTeams.map((team) => team.teamName))].sort().map((teamName) => (
            <option key={teamName} value={teamName}>
              {teamName}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filter by team member..."
          className="border rounded-lg px-4 py-2 w-1/3"
          value={filter}
          onChange={handleFilterChange}
        />
      </div>
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
            {filteredTeamName === "" ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  Please select a team to view performance data.
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{item.name}</td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={item.performance}
                      onChange={(e) => handlePerformanceChange(item.id, e.target.value)}
                      className="border rounded px-2 py-1 w-20"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={item.tasksCompleted}
                      onChange={(e) => handleTasksCompletedChange(item.id, e.target.value)}
                      className="border rounded px-2 py-1 w-20"
                    />
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => alert(`Message sent to ${item.teamMember}`)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2"
                    >
                      <FaEnvelope />
                      <span>Message</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Team Performance Over Time</h2>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <FaChartLine size={50} className="text-gray-400" />
          <span className="text-gray-400 ml-4">Graph Placeholder</span>
        </div>
      </div>
      <div className="mt-8 flex justify-between">
        <button
          onClick={() => alert("Report sent to HR")}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <FaUserTie />
          <span>Send Report to HR</span>
        </button>
        <button
          onClick={() => alert("Report sent to Department Manager")}
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