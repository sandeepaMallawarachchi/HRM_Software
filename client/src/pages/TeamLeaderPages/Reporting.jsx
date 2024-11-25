import React, { useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../../images/hrm withoutbackground.png';
import { FaDownload, FaEnvelope, FaSave } from "react-icons/fa";
import 'jspdf-autotable';
import axios from "axios";
import { Line } from "react-chartjs-2";

const Reporting = () => {
  const [teamData, setTeamData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [filter, setFilter] = useState("");
  const empId = localStorage.getItem("empId");
  const [filteredTeamName, setFilteredTeamName] = useState("");
  const reportRef = useRef(null);
  const chartRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [email, setEmail] = useState("");
  const [isFetching, setIsFetching] = useState(false);

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

  const fetchEmployeeWorkEmail = async (id) => {
    try {
      setIsFetching(true);
      const workResponse = await axios.get(`http://localhost:4000/employees/getWorkDetails/${id}`);
      setEmail(workResponse.data.workEmail);
      
      if (workResponse.data.workEmail) {
        window.location.href = `mailto:${workResponse.data.workEmail}`;
      }
  
      setIsFetching(false);
    } catch (err) {
      console.error(err);
      setIsFetching(false);
    }
  };  

  const handlePerformanceChange = (id, value) => {
    setFilteredData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, performance: value } : item
      )
    );
  };

  const handleTasksCompletedChange = (id, value) => {
    setFilteredData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, taskcompleted: value } : item
      )
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

  const handleSaveChanges = async (empId, teamName, performance, taskcompleted) => {
    try {
      await axios.post(`http://localhost:4000/admin/addPerformance/${empId}/${teamName}`, {
        performance,
        taskcompleted,
      });
      alert("Performance updated successfully");
    } catch (error) {
      console.error("Error updating performance:", error);
      alert("Failed to update performance");
    }
  };

  const chartData = {
    labels: filteredData.map((employee) => employee.name),
    datasets: [
      {
        label: `${filteredTeamName} Performance`,
        data: filteredData.map((employee) => employee.performance),
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
        text: `${filteredTeamName} Performance Over Time`,
      },
    },
  };

  const handleDownload = () => {
    if (!filteredTeamName) return;

    setIsDownloading(true);

    setTimeout(() => {
      const doc = new jsPDF('p', 'pt', 'a4');
      doc.addImage(logo, 'PNG', 40, 40, 50, 50);
      doc.setFontSize(14);
      doc.text('GLOBAL HRM', 100, 60);
      doc.text(`Issue Date: ${new Date().toLocaleDateString('en-CA')}`, 400, 60);

      doc.setFontSize(18);
      doc.text(`Performance Report - ${filteredTeamName}`, 40, 100);

      doc.setFontSize(10);
      doc.autoTable({
        head: [['Team Member', 'Performance (%)', 'Tasks Completed']],
        body: filteredData.map(item => [item.name, item.performance, item.taskcompleted]),
        startY: 120,
        theme: 'grid',
      });

      const chart = chartRef.current;
      if (chart) {
        html2canvas(chart).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          doc.addImage(imgData, 'PNG', 40, doc.lastAutoTable.finalY + 20, 500, 200);
          doc.save(`performance_report_${filteredTeamName}.pdf`);
          setIsDownloading(false);
        });
      } else {
        doc.save(`performance_report_${filteredTeamName}.pdf`);
        setIsDownloading(false);
      }
    }, 2000);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Team Performance Reports</h1>
        <button
          onClick={handleDownload}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          disabled={!filteredTeamName || isDownloading}
        >
          {isDownloading ? (
            <>
              <FaDownload />
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <FaDownload />
              <span>Download Report</span>
            </>
          )}
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
      <div ref={reportRef} className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-4 border-b">Team Member</th>
              <th className="p-4 border-b">Performance (%)</th>
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
                      type="number"
                      value={item.performance}
                      min={0}
                      max={100}
                      onChange={(e) => handlePerformanceChange(item.id, e.target.value)}
                      className="border rounded px-2 py-1 w-20"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="number"
                      value={item.taskcompleted}
                      min={0}
                      max={100}
                      onChange={(e) => handleTasksCompletedChange(item.id, e.target.value)}
                      className="border rounded px-2 py-1 w-20"
                    />
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() =>
                        handleSaveChanges(item.empId, filteredTeamName, item.performance, item.taskcompleted)
                      }
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                    >
                      <FaSave />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => fetchEmployeeWorkEmail(item.empId)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2"
                    >
                      {isFetching ? (
                        <>
                          <FaEnvelope />
                          <span>Opening...</span>
                        </>
                      ) : (
                        <>
                          <FaEnvelope />
                          <span>Message</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div ref={chartRef} className='mt-10'>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Reporting;