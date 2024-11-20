import React, { useEffect, useState } from "react";
import { FaUserEdit, FaTrash, FaEye } from "react-icons/fa";
import NewTeamModel from "./NewTeamModel";
import axios from "axios";

const TeamManage = () => {
  const [teamData, setTeamData] = useState([]);
  const [allTeamData, setAllTeamData] = useState([]);
  const [filteredTeamName, setAllFilteredData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("");
  const [isTeamMembersModalOpen, setIsTeamMembersModalOpen] = useState(false);
  const empId = localStorage.getItem('empId');

  const handleTeamNameChange = async (e) => {
    const selectedTeamName = e.target.value;
    setAllFilteredData(selectedTeamName);

    if (selectedTeamName === "") {
      setFilteredData([]); // Clear data if no team is selected
      return;
    }

    try {
      const requestResponse = await axios.get(`http://localhost:4000/admin/getTeam/${empId}/${selectedTeamName}`);
      setTeamData(requestResponse.data);
      setFilteredData(requestResponse.data);
    } catch (err) {
      console.log("Error fetching filtered team data:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestResponse = await axios.get(`http://localhost:4000/admin/getAllTeams/${empId}`);
        setAllTeamData(requestResponse.data);
        // setFilteredData(requestResponse.data);
      } catch (err) {
        console.log("Error fetching data:", err);
      }
    };
    fetchData();
  }, [empId]);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    if (value === "") {
      setFilteredData(teamData);
    } else {
      const filtered = teamData.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.role.toLowerCase().includes(value.toLowerCase()) ||
        item.department.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const handleTeam = () => {
    setIsTeamMembersModalOpen(true);
  };

  const handleModalClose = () => {
    setIsTeamMembersModalOpen(false);
  };

  const handleSave = (teamData) => {
    console.log("Team Created", teamData);
    setIsTeamMembersModalOpen(false);
  };

  return (
    <div className="p-8 bg-gray-100 h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-700 mb-8">
        Team Management
      </h2>
      <div className="flex justify-between mb-6">
        <div className="flex gap-3">
          <select
            value={filteredTeamName}
            onChange={handleTeamNameChange}
            className="border-gray-300 rounded-md p-2 w-full"
          >
            <option value="">All Teams</option>
            {[...new Set(allTeamData.map((team) => team.teamName))].sort().map((teamName) => (
              <option key={teamName} value={teamName}>
                {teamName}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="p-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Search by name, role, or department..."
            value={filter}
            onChange={handleFilterChange}
          />
        </div>
        <button
          onClick={handleTeam}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg disabled:bg-orange-300"
        >
          New Team
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-orange-500 text-white uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-left">Department</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredData.map((teamMember) => (
              <tr key={teamMember.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <span className="font-medium">{teamMember.name}</span>
                </td>
                <td className="py-3 px-6 text-left">
                  <span>{teamMember.role}</span>
                </td>
                <td className="py-3 px-6 text-left">
                  <span>{teamMember.department}</span>
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex items-center justify-center space-x-4">
                    <button className="text-orange-500 hover:text-orange-600">
                      <FaTrash size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isTeamMembersModalOpen && (
        <NewTeamModel
          onClose={handleModalClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default TeamManage;