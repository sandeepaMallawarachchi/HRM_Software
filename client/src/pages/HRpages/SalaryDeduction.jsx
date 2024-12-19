import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./DeductionsModal.jsx"; // Import the Modal component

const SalaryDeduction = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Store selected employee for modal

  useEffect(() => {
    // Fetch employee data from the backend
    axios
      .get("http://localhost:4000/admin/getAllEmployee") // Replace with your API URL
      .then((response) => {
        const data = response.data;

        // Extract unique departments and designations
        const uniqueDepartments = [
          ...new Set(data.map((employee) => employee.department)),
        ];
        const uniqueDesignations = [
          ...new Set(data.map((employee) => employee.designation)),
        ];

        setEmployees(data);
        setDepartments(uniqueDepartments);
        setDesignations(uniqueDesignations);
      })
      .catch((error) => console.error("Error fetching employee data:", error));
  }, []);

  // Filter employees based on department, designation, and search term
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.empId.toString().includes(searchTerm);
    const matchesDepartment =
      !selectedDepartment || employee.department === selectedDepartment;
    const matchesDesignation =
      !selectedDesignation || employee.designation === selectedDesignation;

    return matchesSearch && matchesDepartment && matchesDesignation;
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Employee Offers</h1>

      {/* Search and Filters */}
      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by Name or ID"
          className="border p-2 flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border p-2"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((dept, index) => (
            <option key={index} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        <select
          className="border p-2"
          value={selectedDesignation}
          onChange={(e) => setSelectedDesignation(e.target.value)}
        >
          <option value="">All Designations</option>
          {designations.map((designation, index) => (
            <option key={index} value={designation}>
              {designation}
            </option>
          ))}
        </select>
      </div>

      {/* Employee Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="border p-2">Emp ID</th>
            <th className="border p-2">Employee Name</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">Designation</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee, index) => (
              <tr key={index} className="border-b">
                <td className="border p-2 text-center">{employee.empId}</td>
                <td className="border p-2">{employee.name}</td>
                <td className="border p-2 text-center">
                  {employee.department}
                </td>
                <td className="border p-2 text-center">
                  {employee.designation}
                </td>
                <td className="border p-2 text-center">{employee.role}</td>
                <td className="border p-2 text-center">
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700"
                    onClick={() => setSelectedEmployee(employee)}
                  >
                    Go Through
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-4">
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      {selectedEmployee && (
        <Modal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
};

export default SalaryDeduction;
