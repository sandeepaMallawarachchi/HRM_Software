import axios from "axios";
import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { FaMoneyBillWave, FaChartLine, FaClipboardList } from "react-icons/fa";

const Budgeting = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("Sales");
  const [departments, setDepartments] = useState([]);

  // Sample budget data for different departments
  const budgetData = {
    Sales: {
      allocated: 500000,
      spent: 400000,
      departments: [
        { name: "Field Sales", budget: 300000, spent: 250000 },
        { name: "Inside Sales", budget: 200000, spent: 150000 },
      ],
    },
    Marketing: {
      allocated: 300000,
      spent: 250000,
      departments: [
        { name: "Digital Marketing", budget: 150000, spent: 100000 },
        { name: "Traditional Marketing", budget: 150000, spent: 150000 },
      ],
    },
    Development: {
      allocated: 600000,
      spent: 550000,
      departments: [
        { name: "Product Development", budget: 400000, spent: 350000 },
        { name: "IT Support", budget: 200000, spent: 200000 },
      ],
    },
    HR: {
      allocated: 200000,
      spent: 150000,
      departments: [
        { name: "Recruitment", budget: 100000, spent: 70000 },
        { name: "Training", budget: 100000, spent: 80000 },
      ],
    },
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:4000/admin/getAllDepartments");
        setDepartments(response.data.map((dept) => dept.department));
      } catch (error) {
        console.error(error);
      }
    };
    fetchDepartments();
  }, [selectedDepartment]);


  const barChartData = {
    labels: ["Allocated", "Spent"],
    datasets: [
      {
        label: `${selectedDepartment} Budget`,
        data: [
          budgetData[selectedDepartment].allocated,
          budgetData[selectedDepartment].spent,
        ],
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
      },
    ],
  };

  const pieChartData = {
    labels: budgetData[selectedDepartment].departments.map((dept) => dept.name),
    datasets: [
      {
        data: budgetData[selectedDepartment].departments.map(
          (dept) => dept.spent
        ),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Budgeting Dashboard
      </h2>

      {/* Department Navigation */}
      <div className="grid grid-cols-6 gap-2 justify-center mb-6">
        {departments.map((department) => (
          <button
            key={department}
            onClick={() => setSelectedDepartment(department)}
            className={`px-4 py-2 rounded-lg ${selectedDepartment === department
              ? "bg-orange-500 text-white"
              : "bg-white text-gray-800 border border-gray-300 hover:bg-orange-100"
              }`}
          >
            {department}
          </button>
        ))}
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaMoneyBillWave className="text-4xl text-green-500 mr-4" />
          <div>
            <h3 className="text-xl font-semibold">Allocated Budget</h3>
            <p className="text-gray-700">
              ${budgetData[selectedDepartment].allocated.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaChartLine className="text-4xl text-blue-500 mr-4" />
          <div>
            <h3 className="text-xl font-semibold">Spent Budget</h3>
            <p className="text-gray-700">
              ${budgetData[selectedDepartment].spent.toLocaleString()}
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
                budgetData[selectedDepartment].allocated -
                budgetData[selectedDepartment].spent
              ).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Bar Chart for Allocated vs Spent Budget */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 h-64">
        <h3 className="text-xl font-semibold mb-4">
          Allocated vs Spent Budget
        </h3>
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
          height={200} // Set the height of the bar chart
        />
      </div>

      {/* Pie Chart for Department Spending */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 h-48">
        <h3 className="text-xl font-semibold mb-4">Department Spending</h3>
        <div className="h-32">
          <Pie
            data={pieChartData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  position: "top",
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      let label = context.label || "";
                      if (context.parsed !== null) {
                        label += `: $${context.parsed.toLocaleString()}`;
                      }
                      return label;
                    },
                  },
                },
              },
            }}
            height={200} // Set the height of the pie chart
          />
        </div>
      </div>

      {/* Budget Details Overview */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">
          Department Budget Details
        </h3>
        <table className="min-w-full bg-white rounded-lg border border-gray-300">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Department</th>
              <th className="border border-gray-300 px-4 py-2">Budget</th>
              <th className="border border-gray-300 px-4 py-2">Spent</th>
            </tr>
          </thead>
          <tbody>
            {budgetData[selectedDepartment].departments.map((dept, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 transition duration-200"
              >
                <td className="border border-gray-300 px-4 py-2">
                  {dept.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ${dept.budget.toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ${dept.spent.toLocaleString()}
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
