import React, { useState } from "react";

// Sample employee payroll data
const initialPayrollData = [
  {
    id: 1,
    name: "Alice Johnson",
    position: "Software Engineer",
    salary: 70000,
  },
  { id: 2, name: "Bob Smith", position: "DevOps Engineer", salary: 75000 },
  { id: 3, name: "Charlie Brown", position: "HR Assistant", salary: 50000 },
  {
    id: 4,
    name: "Diana Prince",
    position: "Sales Representative",
    salary: 60000,
  },
];

const PayrollManagement = () => {
  const [payrollData, setPayrollData] = useState(initialPayrollData);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    position: "",
    salary: "",
  });
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdateEmployee = () => {
    if (editEmployeeId) {
      // Update existing employee
      setPayrollData((prev) =>
        prev.map((employee) =>
          employee.id === editEmployeeId
            ? { ...employee, ...newEmployee }
            : employee
        )
      );
      setEditEmployeeId(null);
    } else {
      // Add new employee
      setPayrollData((prev) => [...prev, { ...newEmployee, id: Date.now() }]);
    }
    setNewEmployee({ name: "", position: "", salary: "" });
  };

  const handleEditEmployee = (employee) => {
    setNewEmployee({
      name: employee.name,
      position: employee.position,
      salary: employee.salary,
    });
    setEditEmployeeId(employee.id);
  };

  const handleDeleteEmployee = (id) => {
    setPayrollData((prev) => prev.filter((employee) => employee.id !== id));
  };

  const filteredPayrollData = payrollData.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Payroll Management</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search for an employee..."
          className="border rounded p-2 mb-4 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h2 className="text-xl font-semibold mb-2">Employee Payroll Records</h2>
      <table className="min-w-full border-collapse border border-gray-200 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 px-4 py-2">Name</th>
            <th className="border border-gray-200 px-4 py-2">Position</th>
            <th className="border border-gray-200 px-4 py-2">Salary</th>
            <th className="border border-gray-200 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayrollData.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-50">
              <td className="border border-gray-200 px-4 py-2">
                {employee.name}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                {employee.position}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                ${employee.salary.toLocaleString()}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                <button
                  onClick={() => handleEditEmployee(employee)}
                  className="text-blue-500 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEmployee(employee.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-semibold mb-2">Add/Update Employee</h2>
      <div className="mb-4">
        <input
          type="text"
          name="name"
          placeholder="Employee Name"
          className="border rounded p-2 mb-2 w-full"
          value={newEmployee.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="position"
          placeholder="Position"
          className="border rounded p-2 mb-2 w-full"
          value={newEmployee.position}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="salary"
          placeholder="Salary"
          className="border rounded p-2 mb-2 w-full"
          value={newEmployee.salary}
          onChange={handleInputChange}
        />
        <button
          onClick={handleAddOrUpdateEmployee}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editEmployeeId ? "Update Employee" : "Add Employee"}
        </button>
      </div>
    </div>
  );
};

export default PayrollManagement;
