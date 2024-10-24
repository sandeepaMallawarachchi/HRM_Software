import React, { useState } from "react";
import { Bar, Line } from "react-chartjs-2"; // Chart components
import { saveAs } from "file-saver"; // For saving reports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registering the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReportsandAnalytics = () => {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const performanceData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Completed Tasks",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Pending Tasks",
        data: [5, 7, 10, 8, 6, 4],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const handleGenerateReport = () => {
    const report = `
      Reports and Analytics
      Date Range: ${dateRange.start} to ${dateRange.end}
      Completed Tasks: ${performanceData.datasets[0].data.reduce(
        (a, b) => a + b
      )}
      Pending Tasks: ${performanceData.datasets[1].data.reduce((a, b) => a + b)}
    `;

    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "report.txt");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Reports and Analytics</h2>

      <div className="mb-4">
        <label className="block mb-2">Select Date Range:</label>
        <input
          type="date"
          value={dateRange.start}
          onChange={(e) =>
            setDateRange({ ...dateRange, start: e.target.value })
          }
          className="border p-2 mr-2"
        />
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          className="border p-2"
        />
        <button
          onClick={handleGenerateReport}
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
        >
          Generate Report
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-2">Team Performance Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-4 rounded">
          <h4 className="font-bold mb-2">Task Completion Over Time</h4>
          <Line
            data={performanceData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>

        <div className="border p-4 rounded">
          <h4 className="font-bold mb-2">Task Status Comparison</h4>
          <Bar
            data={performanceData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-2">Report Summary</h3>
      <div className="border p-4 rounded">
        <p>
          Total Completed Tasks:{" "}
          {performanceData.datasets[0].data.reduce((a, b) => a + b)}
        </p>
        <p>
          Total Pending Tasks:{" "}
          {performanceData.datasets[1].data.reduce((a, b) => a + b)}
        </p>
      </div>
    </div>
  );
};

export default ReportsandAnalytics;
