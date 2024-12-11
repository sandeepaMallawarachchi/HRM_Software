import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaEnvelope, FaDownload } from "react-icons/fa";
import { getDatabase, ref, update } from "firebase/database";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../images/hrm withoutbackground.png";
import { Line, Bar } from "react-chartjs-2";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const PerformanceManage = () => {
  const empId = localStorage.getItem("empId");
  const [teamRecords, setTeamRecords] = useState([]);
  const [filteredTeamRecords, setFilteredTeamRecords] = useState([]);
  const [performanceFilter, setPerformanceFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const chartRef = useRef();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const fetchData = async () => {
      const teamResponse = await axios.get(
        "http://localhost:4000/admin/getTeamAndPerformance"
      );
      setTeamRecords(teamResponse.data);
      setFilteredTeamRecords(teamResponse.data);
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
      if (yearFilter) {
        filtered = filtered.filter(
          (record) =>
            new Date(record.created_at).getFullYear().toString() === yearFilter
        );
      }
      if (monthFilter) {
        filtered = filtered.filter(
          (record) =>
            new Date(record.created_at).getMonth().toString() ===
            monthFilter.toString()
        );
      }

      setFilteredTeamRecords(filtered);
    };

    filterRecords();
  }, [performanceFilter, yearFilter, monthFilter, teamRecords]);

  const handleSave = async (record) => {
    setLoading(true);
    try {
      const chatId = `${record.teamName}`;
      const chatRef = ref(database, "chats/" + chatId);
      const timestamp = Date.now();
      const membersWithEmpId = [...new Set([empId, record.creatorEmpId])];
      await update(chatRef, {
        members: membersWithEmpId,
        timestamp,
      });
      await axios.post(`http://localhost:4000/admin/addMember`, {
        members: membersWithEmpId,
        chatId,
      });
      navigate("/communication");
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: filteredTeamRecords.map((record) => record.teamName),
    datasets: [
      {
        label: "Team Performance (%)",
        data: filteredTeamRecords.map((record) =>
          parseFloat(record.avgPerformance)
        ),
        fill: false,
        borderColor: "#ff7f50",
        tension: 0.1,
      },
    ],
  };

  const barData = {
    labels: months,
    datasets: filteredTeamRecords.map((record) => ({
      label: record.teamName,
      data: months.map((_, index) =>
        record.created_at &&
          new Date(record.created_at).getMonth() === index
          ? parseFloat(record.avgPerformance)
          : 0
      ),
      backgroundColor: "#36A2EB",
    })),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Team Performance Overview" },
    },
  };

  const handleDownload = () => {
    setIsDownloading(true);
    const doc = new jsPDF("p", "pt", "a4");
    doc.addImage(logo, "PNG", 40, 40, 50, 50);
    doc.setFontSize(14);
    doc.text("GLOBAL HRM", 100, 60);
    doc.text(`Issue Date: ${new Date().toLocaleDateString("en-CA")}`, 400, 60);
    doc.setFontSize(18);
    doc.text("Performance Report", 40, 100);
    doc.setFontSize(10);
    doc.autoTable({
      head: [["Team Name", "Performance (%)", "Status"]],
      body: filteredTeamRecords.map((item) => [
        item.teamName,
        item.avgPerformance,
        parseFloat(item.avgPerformance) === 100 ? "Completed" : "Still Working",
      ]),
      startY: 120,
      theme: "grid",
    });
    const chart = chartRef.current;
    if (chart) {
      html2canvas(chart).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 40, doc.lastAutoTable.finalY + 20, 500, 200);
        doc.save("performance_report.pdf");
        setIsDownloading(false);
      });
    } else {
      doc.save("performance_report.pdf");
      setIsDownloading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-CA");
  };

  const years = [...new Set(teamRecords.map((record) => new Date(record.created_at).getFullYear()))];

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Performance Management</h2>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-4">
          <div>
            <label className="mr-2">Filter by Year:</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="border p-2 rounded-lg"
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mr-2">Filter by Month:</label>
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="border p-2 rounded-lg"
            >
              <option value="">All Months</option>
              {months.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mr-2">Filter by Performance (%):</label>
            <input
              type="number"
              value={performanceFilter}
              onChange={(e) => setPerformanceFilter(e.target.value)}
              placeholder="Enter min performance"
              className="border p-2 rounded-lg"
            />
          </div>
        </div>
        <button
          onClick={handleDownload}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          disabled={isDownloading}
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
      <table className="table-auto w-full border-collapse bg-white rounded-lg">
        <thead>
          <tr className="text-left">
            <th className="p-4 border-b">Team</th>
            <th className="p-4 border-b">Creator</th>
            <th className="p-4 border-b">Created Date</th>
            <th className="p-4 border-b">Performance(%)</th>
            <th className="p-4 border-b">Status</th>
            <th className="p-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeamRecords.map((record) => (
            <tr key={record.teamName}>
              <td className="p-4 border-b">{record.teamName}</td>
              <td className="p-4 border-b">{record.creatorName}</td>
              <td className="p-4 border-b">{formatDate(record.created_at)}</td>
              <td className="p-4 border-b">{record.avgPerformance}%</td>
              <td className="p-4 border-b">
                {parseFloat(record.avgPerformance) === 100
                  ? "Completed"
                  : "Still Working"}
              </td>
              <td className="p-4 border-b">
                <button
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2"
                  onClick={() => handleSave(record)}
                  disabled={loading}
                >
                  <FaEnvelope />
                  Chat
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-4 mt-10" ref={chartRef}>
        <div className="flex-1 bg-white rounded-lg">
          <div>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
        <div className="flex-1 bg-white rounded-lg">
          <Bar data={barData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default PerformanceManage;