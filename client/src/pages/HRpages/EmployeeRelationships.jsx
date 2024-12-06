import React, { useState, useEffect } from "react";
import axios from "axios";

const EmployeeRelationships = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [personalDetails, setPersonalDetails] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:4000/admin/getAllEmployee")
      .then((response) => {
        const data = response.data;
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

  const handleEmployeeClick = (empId) => {
    axios
      .get(`http://localhost:4000/employees/getPersonalDetails/${empId}`)
      .then((response) => {
        setPersonalDetails(response.data);
        setModalVisible(true);
      })
      .catch((error) =>
        console.error("Error fetching personal details:", error)
      );
  };

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
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="border p-2">Emp ID</th>
            <th className="border p-2">Employee Name</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">Designation</th>
            <th className="border p-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee, index) => (
              <tr key={index} className="border-b">
                <td className="border p-2 text-center">{employee.empId}</td>
                <td
                  className="border p-2 text-blue-500 cursor-pointer underline"
                  onClick={() => handleEmployeeClick(employee.empId)}
                >
                  {employee.name}
                </td>
                <td className="border p-2 text-center">
                  {employee.department}
                </td>
                <td className="border p-2 text-center">
                  {employee.designation}
                </td>
                <td className="border p-2 text-center">{employee.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {modalVisible && personalDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg overflow-hidden">
            {/* Modal Header */}
            <div className="bg-orange-500 text-white p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Employee Details: {personalDetails.name}
              </h2>
              <button
                className="text-white hover:text-gray-200"
                onClick={() => setModalVisible(false)}
              >
                ✖
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-semibold text-gray-600">
                    Emp ID:
                  </span>
                  <p className="text-gray-800">{personalDetails.empId}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-600">
                    Email:
                  </span>
                  <p className="text-gray-800">{personalDetails.email}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-600">
                    Phone:
                  </span>
                  <p className="text-gray-800">{personalDetails.phone}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-600">
                    Emergency Contact:
                  </span>
                  <p className="text-gray-800">
                    {personalDetails.emergency_contact}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-600">
                    Address:
                  </span>
                  <p className="text-gray-800">{personalDetails.address}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-600">
                    Date of Birth:
                  </span>
                  <p className="text-gray-800">
                    {personalDetails.date_of_birth}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-600">
                    Gender:
                  </span>
                  <p className="text-gray-800">{personalDetails.gender}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-600">
                    Marital Status:
                  </span>
                  <p className="text-gray-800">
                    {personalDetails.marital_status}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-600">
                    Dependents:
                  </span>
                  <p className="text-gray-800">{personalDetails.dependents}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-600">
                    Country:
                  </span>
                  <p className="text-gray-800">{personalDetails.country}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-100 p-4 text-right">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setModalVisible(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeRelationships;
