import React, { useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import { FaChartLine, FaClipboardList, FaMoneyBillWave } from "react-icons/fa";

const StrategicInsights = () => {
  const [selectedMetric, setSelectedMetric] = useState("Revenue");

  // Sample data for various metrics
  const metricsData = {
    Revenue: {
      labels: ["January", "February", "March", "April", "May", "June"],
      data: [50000, 60000, 70000, 80000, 90000, 95000],
      pieData: [15, 35, 25, 25], // For pie chart representation
      pieLabels: ["Product A", "Product B", "Product C", "Product D"],
    },
    Expenses: {
      labels: ["January", "February", "March", "April", "May", "June"],
      data: [30000, 32000, 35000, 37000, 40000, 45000],
      pieData: [25, 25, 30, 20],
      pieLabels: ["Operational", "Marketing", "R&D", "Other"],
    },
    Profit: {
      labels: ["January", "February", "March", "April", "May", "June"],
      data: [20000, 28000, 35000, 43000, 50000, 50000],
      pieData: [50, 25, 25],
      pieLabels: ["Net Profit", "Taxes", "Other Expenses"],
    },
  };

  const lineChartData = {
    labels: metricsData[selectedMetric].labels,
    datasets: [
      {
        label: selectedMetric,
        data: metricsData[selectedMetric].data,
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
      },
    ],
  };

  const pieChartData = {
    labels: metricsData[selectedMetric].pieLabels,
    datasets: [
      {
        data: metricsData[selectedMetric].pieData,
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4caf50"],
      },
    ],
  };

  const handleMetricChange = (metric) => {
    setSelectedMetric(metric);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Strategic Insights Dashboard
      </h2>

      {/* Metric Navigation */}
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

      {/* Line Chart for Selected Metric */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 h-64">
        <h3 className="text-xl font-semibold mb-4">
          Monthly {selectedMetric} Overview
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

      {/* Overall Metrics Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg shadow-md flex items-center justify-between">
          <div className="flex items-center">
            <FaChartLine className="text-4xl text-blue-500 mr-4" />
            <div>
              <h4 className="text-lg font-semibold">Total Revenue</h4>
              <p className="text-gray-700">
                ${metricsData.Revenue.data[metricsData.Revenue.data.length - 1]}
              </p>
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {metricsData.Revenue.data[metricsData.Revenue.data.length - 1] > 0
              ? "+"
              : ""}
            {metricsData.Revenue.data[metricsData.Revenue.data.length - 1]}
          </div>
        </div>

        <div className="bg-green-100 p-4 rounded-lg shadow-md flex items-center justify-between">
          <div className="flex items-center">
            <FaMoneyBillWave className="text-4xl text-green-500 mr-4" />
            <div>
              <h4 className="text-lg font-semibold">Total Profit</h4>
              <p className="text-gray-700">
                ${metricsData.Profit.data[metricsData.Profit.data.length - 1]}
              </p>
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {metricsData.Profit.data[metricsData.Profit.data.length - 1] > 0
              ? "+"
              : ""}
            {metricsData.Profit.data[metricsData.Profit.data.length - 1]}
          </div>
        </div>

        <div className="bg-yellow-100 p-4 rounded-lg shadow-md flex items-center justify-between">
          <div className="flex items-center">
            <FaClipboardList className="text-4xl text-yellow-500 mr-4" />
            <div>
              <h4 className="text-lg font-semibold">Total Expenses</h4>
              <p className="text-gray-700">
                $
                {
                  metricsData.Expenses.data[
                    metricsData.Expenses.data.length - 1
                  ]
                }
              </p>
            </div>
          </div>
          <div className="text-2xl font-bold text-yellow-600">
            {metricsData.Expenses.data[metricsData.Expenses.data.length - 1] > 0
              ? "+"
              : ""}
            {metricsData.Expenses.data[metricsData.Expenses.data.length - 1]}
          </div>
        </div>
      </div>

      {/* Pie Chart for Selected Metric Breakdown */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">
          {selectedMetric} Breakdown
        </h3>
        <div className="h-64">
          <Pie
            data={pieChartData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  position: "top",
                },
              },
            }}
            height={200}
          />
        </div>
      </div>
    </div>
  );
};

export default StrategicInsights;
