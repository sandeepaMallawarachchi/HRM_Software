import React, { useState, useEffect } from "react";

// Mock data for departments and employees
const mockDepartments = [
  {
    id: 1,
    name: "Sales",
    employees: [
      {
        id: 101,
        name: "Alice",
        performance: "Excellent",
        achievements: ["Top Salesperson", "Best Customer Feedback"],
        salary: 70000,
      },
      {
        id: 102,
        name: "Bob",
        performance: "Good",
        achievements: ["Consistent Performer"],
        salary: 60000,
      },
    ],
  },
  {
    id: 2,
    name: "Marketing",
    employees: [
      {
        id: 201,
        name: "Charlie",
        performance: "Average",
        achievements: ["Campaign of the Month"],
        salary: 50000,
      },
      {
        id: 202,
        name: "David",
        performance: "Excellent",
        achievements: ["Social Media Guru"],
        salary: 80000,
      },
    ],
  },
  // Add more departments as needed
];

const TalentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    // Fetch departments from an API or use mock data
    setDepartments(mockDepartments);
  }, []);

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
    setSelectedEmployee(null); // Reset selected employee when department changes
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
  };

  const handlePromoteEmployee = () => {
    // Logic to promote the employee
    alert(`Promoting ${selectedEmployee.name}...`);
    // Inform HR about the promotion (e.g., send a notification or update HR records)
  };

  const handleIncrementSalary = () => {
    // Logic to increment the employee's salary
    const newSalary = selectedEmployee.salary + 5000; // Increment by $5000
    alert(
      `Incrementing salary for ${selectedEmployee.name} to $${newSalary}...`
    );
    // Inform HR about the salary increment
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Talent Management Dashboard
      </h1>

      {/* Department Selection */}
      <div className="mb-6">
        <h2 className="text-xl">Select Department:</h2>
        <ul className="space-y-2">
          {departments.map((dept) => (
            <li
              key={dept.id}
              className="cursor-pointer hover:bg-gray-200 p-2 rounded"
              onClick={() => handleDepartmentSelect(dept)}
            >
              {dept.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Selected Department Employees */}
      {selectedDepartment && (
        <div>
          <h2 className="text-xl mb-4">
            Employees in {selectedDepartment.name}:
          </h2>
          <ul className="space-y-2">
            {selectedDepartment.employees.map((emp) => (
              <li
                key={emp.id}
                className="cursor-pointer hover:bg-gray-200 p-2 rounded"
                onClick={() => handleEmployeeSelect(emp)}
              >
                {emp.name} - Performance: {emp.performance}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Selected Employee Details */}
      {selectedEmployee && (
        <div className="mt-4 bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-lg font-semibold">Employee Details:</h3>
          <p>Name: {selectedEmployee.name}</p>
          <p>Performance: {selectedEmployee.performance}</p>
          <p>Achievements: {selectedEmployee.achievements.join(", ")}</p>
          <p>Current Salary: ${selectedEmployee.salary}</p>

          <div className="mt-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 mr-2 rounded hover:bg-blue-600 transition duration-200"
              onClick={handlePromoteEmployee}
            >
              Promote
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
              onClick={handleIncrementSalary}
            >
              Increment Salary
            </button>
          </div>
        </div>
      )}

      {/* Summary of Department Performance */}
      {selectedDepartment && (
        <div className="mt-6 bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">
            Department Performance Summary:
          </h3>
          <p>Total Employees: {selectedDepartment.employees.length}</p>
          <p>
            Overall Performance:
            {(selectedDepartment.employees.reduce((acc, emp) => {
              if (emp.performance === "Excellent") return acc + 1;
              if (emp.performance === "Good") return acc + 0.75;
              if (emp.performance === "Average") return acc + 0.5;
              return acc;
            }, 0) /
              selectedDepartment.employees.length) *
              100}
            %
          </p>
        </div>
      )}
    </div>
  );
};

export default TalentManagement;
