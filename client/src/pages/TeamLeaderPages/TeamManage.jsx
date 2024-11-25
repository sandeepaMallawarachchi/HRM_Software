import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import NewTeamModel from "./NewTeamModel";
import axios from "axios";
import UpdateTeamModel from "./UpdateTeamModel";

const TeamManage = () => {
  const [teamData, setTeamData] = useState([]);
  const [allTeamData, setAllTeamData] = useState([]);
  const [filteredTeamName, setFilteredTeamName] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("");
  const [isTeamMembersModalOpen, setIsTeamMembersModalOpen] = useState(false);
  const [isUpdateTeamModalOpen, setIsUpdateTeamModalOpen] = useState(false);
  const empId = localStorage.getItem("empId");

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
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/admin/getAllTeams/${empId}`);
        setAllTeamData(response.data);
      } catch (err) {
        console.error(err);
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

  const handleNewTeam = () => {
    setIsTeamMembersModalOpen(true);
  };

  const handleUpdate = (teamName) => {
    setFilteredTeamName(teamName);
    setIsUpdateTeamModalOpen(true);
  };

  const handleModalClose = () => {
    setIsTeamMembersModalOpen(false);
    setIsUpdateTeamModalOpen(false);
  };

  const handleDeleteTeamMember = async (memberEmpId, teamName) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this member?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:4000/admin/deleteTeamMember/${memberEmpId}/${teamName}`);
        setFilteredData((prevData) => prevData.filter((member) => member.empId !== memberEmpId));
      } catch (error) {
        alert("Failed to delete team member.");
      }
    }
  };

  return (
    <div className="p-8 bg-gray-100 h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-700 mb-8">
        Team Management
      </h2>
      <div className="flex flex-wrap justify-between gap-4 items-center mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={filteredTeamName}
            onChange={handleTeamNameChange}
            className="border border-gray-300 rounded-md p-2 w-60 sm:w-72 lg:w-80"
          >
            <option value="">Select a Team</option>
            {[...new Set(allTeamData.map((team) => team.teamName))].sort().map((teamName) => (
              <option key={teamName} value={teamName}>
                {teamName}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="p-2 border border-gray-300 rounded-lg w-60 sm:w-72 lg:w-80"
            placeholder="Search by name, role, or department..."
            value={filter}
            onChange={handleFilterChange}
          />
          <button
            onClick={() => handleUpdate(filteredTeamName)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300"
          >
            Update Team
          </button>
        </div>
        <button
          onClick={handleNewTeam}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition duration-300"
        >
          New Team
        </button>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
      <table className="table-auto w-full border-collapse">
      <thead>
      <tr className="bg-gray-100 text-left">
      <th className="p-4 border-b">Name</th>
              <th className="p-4 border-b">Role</th>
              <th className="p-4 border-b">Department</th>
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
              filteredData.map((teamMember) => (
                <tr key={teamMember.id} className="border-b">
                  <td className="p-4">
                    <span className="font-medium">{teamMember.name}</span>
                  </td>
                  <td className="p-4">
                    <span>{teamMember.role}</span>
                  </td>
                  <td className="p-4">
                    <span>{teamMember.department}</span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDeleteTeamMember(teamMember.empId, filteredTeamName)}
                      className="text-orange-500 hover:text-orange-600"
                    >
                      <FaTrash size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {isTeamMembersModalOpen && (
        <NewTeamModel onClose={handleModalClose} />
      )}
      {isUpdateTeamModalOpen && (
        <UpdateTeamModel teamName={filteredTeamName} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default TeamManage;