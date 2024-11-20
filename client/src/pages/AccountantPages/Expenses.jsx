import React from "react";
import { Line, Pie } from "react-chartjs-2";
import { FaClipboardList } from "react-icons/fa";

const Expenses = () => {
  const expenseData = {
    categories: [
      { name: "Operational Costs", value: 15000 },
      { name: "Marketing", value: 8000 },
      { name: "Research & Development", value: 5000 },
      { name: "Miscellaneous", value: 3000 },
    ],
    monthlyExpenses: [12000, 15000, 10000, 18000, 14000, 16000],
  };

  const pieChartData = {
    labels: expenseData.categories.map((cat) => cat.name),
    datasets: [
      {
        data: expenseData.categories.map((cat) => cat.value),
        backgroundColor: ["#4caf50", "#ff9800", "#2196f3", "#ff5722"],
      },
    ],
  };

  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Monthly Expenses",
        data: expenseData.monthlyExpenses,
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Expenses Management
      </h2>

      {/* Expense Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {expenseData.categories.map((category, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
          >
            <div className="flex items-center">
              <FaClipboardList className="text-4xl text-blue-500 mr-4" />
              <div>
                <h4 className="text-lg font-semibold">{category.name}</h4>
                <p className="text-gray-700">
                  ${category.value.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-xl font-bold text-green-600">
              {((category.value / 30000) * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Expense Distribution</h3>
        <div className="flex justify-center">
          <Pie
            data={pieChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
            width={300}
            height={300}
          />
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Monthly Expenses</h3>
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
    </div>
  );
};

export default Expenses;
