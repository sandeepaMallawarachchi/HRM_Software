import React, { useState, useEffect } from "react";
import axios from "axios";

const TalentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeList, setEmployeeList] = useState([]); // List of all employees
  const [filteredEmployeeList, setFilteredEmployeeList] = useState([]); // Filtered list based on role

  // Fetch employee data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/admin/getAllEmployee"
        );
        setEmployeeList(response.data);
        setFilteredEmployeeList(response.data); // Initialize with all employees
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };
    fetchData();
  }, []);

  // Use departments and filter employees based on the department
  useEffect(() => {
    if (employeeList.length > 0) {
      // Group employees by departments
      const groupedDepartments = employeeList.reduce((acc, employee) => {
        const department = employee.department;
        if (!acc[department])
          acc[department] = { name: department, employees: [] };
        acc[department].employees.push(employee);
        return acc;
      }, {});

      setDepartments(Object.values(groupedDepartments)); // Set the departments
    }
  }, [employeeList]);

  const handleDepartmentSelect = (e) => {
    const departmentName = e.target.value;
    const department = departments.find((dept) => dept.name === departmentName);
    setSelectedDepartment(department);
    setSelectedEmployee(null); // Reset selected employee when department changes

    // Automatically filter "Mid Lvl Manager" for the selected department
    const filteredEmployees = department.employees.filter(
      (emp) => emp.role === "Mid Lvl Manager"
    );
    setFilteredEmployeeList(filteredEmployees);
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
  };

  const handlePromoteEmployee = () => {
    alert(`Promoting ${selectedEmployee.name}...`);
  };

  const handleIncrementSalary = () => {
    const newSalary = selectedEmployee.salary + 5000;
    alert(
      `Incrementing salary for ${selectedEmployee.name} to $${newSalary}...`
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Talent Management Dashboard
      </h1>

      {/* Department Dropdown */}
      <div className="mb-6">
        <h2 className="text-xl">Select Department:</h2>
        <select
          onChange={handleDepartmentSelect}
          className="p-2 border rounded"
          defaultValue=""
        >
          <option value="" disabled>
            Select Department
          </option>
          {departments.map((dept) => (
            <option key={dept.name} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      {/* Selected Department Employees */}
      {selectedDepartment && (
        <div>
          <h2 className="text-xl mb-4">
            Mid Level Managers in {selectedDepartment.name}:
          </h2>
          <ul className="space-y-2">
            {filteredEmployeeList.length > 0 ? (
              filteredEmployeeList.map((emp) => (
                <li
                  key={emp.id}
                  className="cursor-pointer hover:bg-gray-200 p-2 rounded"
                  onClick={() => handleEmployeeSelect(emp)}
                >
                  {emp.name} - Role: {emp.role} - Performance: {emp.performance}
                </li>
              ))
            ) : (
              <li>No Mid Level Managers found in this department.</li>
            )}
          </ul>
        </div>
      )}

      {/* Selected Employee Details */}
      {selectedEmployee && (
        <div className="mt-4 bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-lg font-semibold">Employee Details:</h3>
          <p>Name: {selectedEmployee.name}</p>
          <p>Role: {selectedEmployee.role}</p>
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
