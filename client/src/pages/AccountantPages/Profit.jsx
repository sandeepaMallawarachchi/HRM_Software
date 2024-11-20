import React from "react";
import { Line, Bar } from "react-chartjs-2";
import { FaChartLine, FaHandHoldingUsd, FaMoneyBillWave } from "react-icons/fa";

const Profit = () => {
  const profitData = {
    monthlyProfit: [8000, 12000, 10000, 14000, 16000, 18000],
    quarterlyProfit: [40000, 45000, 48000, 50000],
    totalRevenue: 200000,
    totalExpenses: 140000,
    netProfit: 60000,
  };

  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Monthly Profit ($)",
        data: profitData.monthlyProfit,
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "Quarterly Profit ($)",
        data: profitData.quarterlyProfit,
        backgroundColor: ["#4caf50", "#2196f3", "#ff9800", "#ff5722"],
      },
    ],
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Profit Overview
      </h2>

      {/* Profit Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaMoneyBillWave className="text-4xl text-green-500 mr-4" />
          <div>
            <h4 className="text-lg font-semibold">Total Revenue</h4>
            <p className="text-gray-700">
              ${profitData.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaHandHoldingUsd className="text-4xl text-red-500 mr-4" />
          <div>
            <h4 className="text-lg font-semibold">Total Expenses</h4>
            <p className="text-gray-700">
              ${profitData.totalExpenses.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaChartLine className="text-4xl text-blue-500 mr-4" />
          <div>
            <h4 className="text-lg font-semibold">Net Profit</h4>
            <p className="text-gray-700">
              ${profitData.netProfit.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Line Chart for Monthly Profit */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Monthly Profit Trend</h3>
        <div className="flex justify-center">
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
            width={400}
            height={300}
          />
        </div>
      </div>

      {/* Bar Chart for Quarterly Profit */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Quarterly Profit</h3>
        <div className="flex justify-center">
          <Bar
            data={barChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
            width={400}
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default Profit;
