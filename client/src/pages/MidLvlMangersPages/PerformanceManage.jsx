import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEnvelope } from "react-icons/fa";
import { getDatabase, ref, update } from "firebase/database";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase";
import { useNavigate } from "react-router-dom";

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const PerformanceManage = () => {
  const empId = localStorage.getItem("empId");
  const [teamRecords, setTeamRecords] = useState([]);
  const [filteredTeamRecords, setFilteredTeamRecords] = useState([]);
  const [performanceFilter, setPerformanceFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamResponse = await axios.get(
          "http://localhost:4000/admin/getTeamAndPerformance"
        );
        setTeamRecords(teamResponse.data);
        setFilteredTeamRecords(teamResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filterRecords = () => {
      let filtered = teamRecords;

      if (performanceFilter) {
        filtered = filtered.filter(
          (record) => parseFloat(record.avgPerformance) >= performanceFilter
        );
      }

      setFilteredTeamRecords(filtered);
    };

    filterRecords();
  }, [performanceFilter, teamRecords]);

  const handleSave = async (record) => {
    setLoading(true); // Show loading state
    try {
      const chatId = `${record.teamName}`;
      const chatRef = ref(database, "chats/" + chatId);
      const timestamp = Date.now();
      const membersWithEmpId = [...new Set([empId, record.creatorEmpId])];
      await update(chatRef, {
        members: membersWithEmpId,
        timestamp: timestamp,
      });

      const newMember = {
        members: membersWithEmpId,
        chatId,
      };

      await axios.post(`http://localhost:4000/admin/addMember`, newMember);
      navigate('/communication');
    } catch (error) {
      console.error("Error adding members to chat:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Performance Management</h2>

      <div className="mb-4">
        <div>
          <label className="mr-2">Filter by Performance (%):</label>
          <input
            type="number"
            value={performanceFilter}
            onChange={(e) => setPerformanceFilter(e.target.value)}
            className="border p-2 rounded-lg"
            placeholder="Enter minimum percentage"
          />
        </div>
      </div>

      <table className="table-auto w-full border-collapse bg-white rounded-lg">
        <thead>
          <tr className="text-left">
            <th className="p-4 border-b">Team</th>
            <th className="p-4 border-b">Creator</th>
            <th className="p-4 border-b">Performance(%)</th>
            <th className="p-4 border-b">Status</th>
            <th className="p-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeamRecords.length > 0 ? (
            filteredTeamRecords.map((record) => (
              <tr key={record.teamName}>
                <td className="p-4 border-b">{record.teamName}</td>
                <td className="p-4 border-b">{record.creatorName}</td>
                <td className="p-4 border-b">{record.avgPerformance}%</td>
                {parseFloat(record.avgPerformance) === 100 ? (
                  <td className="p-4 border-b text-green-500">Completed</td>
                ) : (
                  <td className="p-4 border-b text-orange-500">Still Working</td>
                )}
                <td className="p-4 border-b">
                  <button
                    onClick={() => handleSave(record)}
                    disabled={loading}
                    className={`${loading ? "bg-gray-500 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
                      } text-white px-4 py-2 rounded-lg flex items-center gap-2`}
                  >
                    <FaEnvelope />
                    <span>{loading ? "Opening..." : "Message"}</span>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border px-4 py-2 text-center">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PerformanceManage;