import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { FaChartLine, FaClipboardList, FaMoneyBillWave } from "react-icons/fa";

const StrategicInsights = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(
    "Human Resources (HR)"
  );
  const [selectedMetric, setSelectedMetric] = useState("Revenue");
  const [selectedTimeframe, setSelectedTimeframe] = useState("This Month");
  const [metricsData, setMetricsData] = useState({});

  const departments = [
    "Human Resources (HR)",
    "Finance and Accounting",
    "Sales",
    "Marketing",
    "Operations",
    "IT (Information Technology)",
    "Customer Service",
    "Research and Development (R&D)",
    "Legal",
    "Executive Management",
  ];

  const timeframes = ["This Month", "Last 6 Months", "Last 2 Years"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/employees/strategic-insights?department=${selectedDepartment}`
        );
        const data = response.data;

        setMetricsData({
          Revenue: {
            "This Month": data.map((item) => item["Revenue (This Month)"]),
            "Last 6 Months": data.map(
              (item) => item["Revenue (Last 6 Months)"]
            ),
            "Last 2 Years": data.map((item) => item["Revenue (Last 2 Years)"]),
          },
          Expenses: {
            "This Month": data.map((item) => item["Expenses (This Month)"]),
            "Last 6 Months": data.map(
              (item) => item["Expenses (Last 6 Months)"]
            ),
            "Last 2 Years": data.map((item) => item["Expenses (Last 2 Years)"]),
          },
          Profit: {
            "This Month": data.map((item) => item["Profit (This Month)"]),
            "Last 6 Months": data.map((item) => item["Profit (Last 6 Months)"]),
            "Last 2 Years": data.map((item) => item["Profit (Last 2 Years)"]),
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedDepartment]);

  const lineChartData = {
    labels: ["Last 2 Years", "Last 6 Months", "This Month"],
    datasets: [
      {
        label: selectedMetric,
        data: [
          metricsData[selectedMetric]?.["Last 2 Years"]?.[0],
          metricsData[selectedMetric]?.["Last 6 Months"]?.[0],
          metricsData[selectedMetric]?.["This Month"]?.[0],
        ],
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
      },
    ],
  };

  const handleMetricChange = (metric) => {
    setSelectedMetric(metric);
  };

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Strategic Insights Dashboard
      </h2>

      <div className="mb-6">
        <label className="mr-4">Select Department:</label>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          {departments.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-center mb-6">
        {timeframes.map((timeframe) => (
          <button
            key={timeframe}
            onClick={() => handleTimeframeChange(timeframe)}
            className={`px-4 py-2 mx-2 rounded-lg ${
              selectedTimeframe === timeframe
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-800 border border-gray-300"
            }`}
          >
            {timeframe}
          </button>
        ))}
      </div>

      <div className="flex justify-center mb-6">
        {Object.keys(metricsData).map((metric) => (
          <button
            key={metric}
            onClick={() => handleMetricChange(metric)}
            className={`px-4 py-2 mx-2 rounded-lg ${
              selectedMetric === metric
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-800 border border-gray-300"
            }`}
          >
            {metric}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6 h-64">
        <h3 className="text-xl font-semibold mb-4">
          {selectedMetric} Overview
        </h3>
        <Line
          data={lineChartData}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg shadow-md flex items-center justify-between">
          <div className="flex items-center">
            <FaChartLine className="text-4xl text-blue-500 mr-4" />
            <div>
              <h4 className="text-lg font-semibold">Total Revenue</h4>
              <p className="text-gray-700">
                $
                {
                  metricsData.Revenue?.[selectedTimeframe]?.[
                    metricsData.Revenue[selectedTimeframe].length - 1
                  ]
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-100 p-4 rounded-lg shadow-md flex items-center justify-between">
          <div className="flex items-center">
            <FaClipboardList className="text-4xl text-green-500 mr-4" />
            <div>
              <h4 className="text-lg font-semibold">Total Expenses</h4>
              <p className="text-gray-700">
                $
                {
                  metricsData.Expenses?.[selectedTimeframe]?.[
                    metricsData.Expenses[selectedTimeframe].length - 1
                  ]
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-100 p-4 rounded-lg shadow-md flex items-center justify-between">
          <div className="flex items-center">
            <FaMoneyBillWave className="text-4xl text-yellow-500 mr-4" />
            <div>
              <h4 className="text-lg font-semibold">Total Profit</h4>
              <p className="text-gray-700">
                $
                {
                  metricsData.Profit?.[selectedTimeframe]?.[
                    metricsData.Profit[selectedTimeframe].length - 1
                  ]
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicInsights;
