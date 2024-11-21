import React, { useState, useEffect } from "react";

// Sample data for employees (you would normally fetch this from an API)
const sampleEmployees = [
  {
    id: 1,
    name: "Alice Johnson",
    department: "HR",
    role: "HR Manager",
    email: "alice@example.com",
    phone: "555-0123",
  },
  {
    id: 2,
    name: "Bob Smith",
    department: "Sales",
    role: "Sales Executive",
    email: "bob@example.com",
    phone: "555-0456",
  },
  {
    id: 3,
    name: "Charlie Brown",
    department: "Marketing",
    role: "Marketing Specialist",
    email: "charlie@example.com",
    phone: "555-0789",
  },
  {
    id: 4,
    name: "Diana Prince",
    department: "IT",
    role: "Software Developer",
    email: "diana@example.com",
    phone: "555-1011",
  },
  {
    id: 5,
    name: "Eve Adams",
    department: "Sales",
    role: "Sales Manager",
    email: "eve@example.com",
    phone: "555-1213",
  },
  {
    id: 6,
    name: "Frank Castle",
    department: "IT",
    role: "Network Engineer",
    email: "frank@example.com",
    phone: "555-1415",
  },
  // Add more employees as needed
];

const EmployeeRelationships = () => {
  const [employees, setEmployees] = useState(sampleEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("HR"); // Default tab
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    // Filter employees based on active tab and search term
    const results = employees.filter(
      (employee) =>
        employee.department === activeTab &&
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(results);
  }, [searchTerm, activeTab, employees]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Employee Relationships</h1>

      <div className="mb-4">
        <button
          onClick={() => setActiveTab("HR")}
          className={`mr-2 px-4 py-2 rounded ${
            activeTab === "HR" ? "bg-orange-500 text-white" : "bg-gray-200"
          }`}
        >
          HR
        </button>
        <button
          onClick={() => setActiveTab("Sales")}
          className={`mr-2 px-4 py-2 rounded ${
            activeTab === "Sales" ? "bg-orange-500 text-white" : "bg-gray-200"
          }`}
        >
          Sales
        </button>
        <button
          onClick={() => setActiveTab("Marketing")}
          className={`mr-2 px-4 py-2 rounded ${
            activeTab === "Marketing"
              ? "bg-orange-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Marketing
        </button>
        <button
          onClick={() => setActiveTab("IT")}
          className={`px-4 py-2 rounded ${
            activeTab === "IT" ? "bg-orange-500 text-white" : "bg-gray-200"
          }`}
        >
          IT
        </button>
      </div>

      <input
        type="text"
        placeholder="Search employees by name..."
        className="border rounded p-2 mb-4 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 px-4 py-2">Name</th>
            <th className="border border-gray-200 px-4 py-2">Department</th>
            <th className="border border-gray-200 px-4 py-2">Role</th>
            <th className="border border-gray-200 px-4 py-2">Email</th>
            <th className="border border-gray-200 px-4 py-2">Phone</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-50">
              <td className="border border-gray-200 px-4 py-2">
                {employee.name}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                {employee.department}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                {employee.role}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                {employee.email}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                {employee.phone}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeRelationships;
