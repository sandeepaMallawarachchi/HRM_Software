import React, { useState } from "react";

// Sample onboarding data for each department
const onboardingDataByDepartment = {
  IT: [
    {
      id: 1,
      name: "Alice Johnson",
      position: "Software Engineer",
      startDate: "2024-10-01",
      status: "In Progress",
    },
    {
      id: 2,
      name: "Bob Smith",
      position: "DevOps Engineer",
      startDate: "2024-10-15",
      status: "Pending",
    },
  ],
  HR: [
    {
      id: 3,
      name: "Charlie Brown",
      position: "HR Assistant",
      startDate: "2024-10-20",
      status: "Completed",
    },
  ],
  Sales: [
    {
      id: 4,
      name: "Diana Prince",
      position: "Sales Representative",
      startDate: "2024-10-05",
      status: "In Progress",
    },
  ],
};

const OnboardingProcess = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("IT");
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    position: "",
    startDate: "",
    status: "Pending",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  const handleAddEmployee = () => {
    onboardingDataByDepartment[selectedDepartment].push({
      ...newEmployee,
      id: Date.now(),
    });
    setNewEmployee({
      name: "",
      position: "",
      startDate: "",
      status: "Pending",
    });
  };

  const filteredOnboardingData = onboardingDataByDepartment[
    selectedDepartment
  ].filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Onboarding Process Management</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search for an employee..."
          className="border rounded p-2 mb-4 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h2 className="text-xl font-semibold mb-2">Select Department</h2>
      <div className="flex mb-4">
        {Object.keys(onboardingDataByDepartment).map((department) => (
          <button
            key={department}
            onClick={() => setSelectedDepartment(department)}
            className={`p-2 mr-2 rounded ${
              selectedDepartment === department
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {department}
          </button>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-2">
        Current Onboarding Employees in {selectedDepartment}
      </h2>
      <table className="min-w-full border-collapse border border-gray-200 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 px-4 py-2">Name</th>
            <th className="border border-gray-200 px-4 py-2">Position</th>
            <th className="border border-gray-200 px-4 py-2">Start Date</th>
            <th className="border border-gray-200 px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredOnboardingData.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-50">
              <td className="border border-gray-200 px-4 py-2">
                {employee.name}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                {employee.position}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                {employee.startDate}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                {employee.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-semibold mb-2">Add New Employee</h2>
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
          type="date"
          name="startDate"
          className="border rounded p-2 mb-2 w-full"
          value={newEmployee.startDate}
          onChange={handleInputChange}
        />
        <select
          name="status"
          className="border rounded p-2 mb-2 w-full"
          value={newEmployee.status}
          onChange={handleInputChange}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button
          onClick={handleAddEmployee}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Employee
        </button>
      </div>
    </div>
  );
};

export default OnboardingProcess;
