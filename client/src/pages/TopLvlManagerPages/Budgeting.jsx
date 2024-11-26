import axios from "axios";
import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { FaMoneyBillWave, FaChartLine, FaClipboardList } from "react-icons/fa";

const Budgeting = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("Sales");
  const [departments, setDepartments] = useState([]);
  const [allocatedBudget, setAllocatedBudget] = useState([]);
  const [spentBudget, setSpentBudget] = useState({ expenses: [], totals: {} });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:4000/admin/getAllDepartments");
        setDepartments(response.data.map((dept) => dept.department));
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    const fetchAllocatedBudget = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/admin/getAllocatedBudget/${selectedDepartment}/${new Date().getFullYear()}/${new Date().getMonth() + 1}`
        );
        setAllocatedBudget(response.data);
      } catch (error) {
        console.error("Error fetching allocated budget:", error);
      }
    };

    const fetchSpentBudget = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/admin/getSpentBudget/${selectedDepartment}/${new Date().getFullYear()}/${new Date().getMonth() + 1}`
        );
        setSpentBudget(response.data);
      } catch (error) {
        console.error("Error fetching spent budget:", error);
      }
    };

    fetchDepartments();
    fetchAllocatedBudget();
    fetchSpentBudget();
  }, [selectedDepartment]);

  const barChartData = {
    labels: ["Allocated", "Spent"],
    datasets: [
      {
        label: `${selectedDepartment} Budget`,
        data: [
          allocatedBudget.reduce((sum, budget) => sum + budget.amount, 0),
          Object.values(spentBudget.totals).reduce((sum, value) => sum + value, 0),
        ],
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
      },
    ],
  };

  const pieChartData = {
    labels: ["Operational Costs", "Marketing", "R&D", "Miscellaneous"],
    datasets: [
      {
        data: [
          spentBudget.totals["Operational Costs"] || 0,
          spentBudget.totals.Marketing || 0,
          spentBudget.totals["Research & Development"] || 0,
          spentBudget.totals.Miscellaneous || 0,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Budgeting Dashboard
      </h2>

      <div className="grid grid-cols-6 gap-2 justify-center mb-6">
        {departments.map((department) => (
          <button
            key={department}
            onClick={() => setSelectedDepartment(department)}
            className={`px-4 py-2 rounded-lg ${
              selectedDepartment === department
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-800 border border-gray-300 hover:bg-orange-100"
            }`}
          >
            {department}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaMoneyBillWave className="text-4xl text-green-500 mr-4" />
          <div>
            <h3 className="text-xl font-semibold">Allocated Budget</h3>
            <p className="text-gray-700">
              ${allocatedBudget.reduce((sum, budget) => sum + budget.amount, 0).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaChartLine className="text-4xl text-blue-500 mr-4" />
          <div>
            <h3 className="text-xl font-semibold">Spent Budget</h3>
            <p className="text-gray-700">
              ${Object.values(spentBudget.totals).reduce((sum, value) => sum + value, 0).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaClipboardList className="text-4xl text-yellow-500 mr-4" />
          <div>
            <h3 className="text-xl font-semibold">Remaining Budget</h3>
            <p className="text-gray-700">
              $
              {(
                allocatedBudget.reduce((sum, budget) => sum + budget.amount, 0) -
                Object.values(spentBudget.totals).reduce((sum, value) => sum + value, 0)
              ).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6 h-64">
        <h3 className="text-xl font-semibold mb-4">Allocated vs Spent Budget</h3>
        <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6 h-48">
        <h3 className="text-xl font-semibold mb-4">Spending Breakdown</h3>
        <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: true }} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Department Budget Details</h3>
        <table className="min-w-full bg-white rounded-lg border border-gray-300">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Allocated Budget</th>
              <th className="border border-gray-300 px-4 py-2">Expenses</th>
            </tr>
          </thead>
          <tbody>
            {spentBudget.expenses.map((expense, index) => (
              <tr key={index} className="hover:bg-gray-100 transition duration-200">
                <td className="border border-gray-300 px-4 py-2">{expense.Date}</td>
                <td className="border border-gray-300 px-4 py-2">
                  ${allocatedBudget.find((alloc) => alloc.date === expense.Date)?.amount || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ${Object.values(expense).reduce((sum, value) => (typeof value === "number" ? sum + value : sum), 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Budgeting;
