import React, { useState, useEffect } from "react";
import axios from "axios";
import SalaryDeduction from "./SalaryDeduction";

const PayrollManagement = () => {
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const [formData, setFormData] = useState({
    department: "",
    designation: "",
    basic_salary: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [filterData, setFilterData] = useState({
    department: "",
    designation: "",
  });

  const [activeTab, setActiveTab] = useState("salary"); // State for active tab

  // Fetch salaries and employee data on component mount
  useEffect(() => {
    fetchSalaries();
    fetchEmployeeData();
  }, []);

  useEffect(() => {
    // Apply filters when filter data changes
    filterSalaries();
  }, [filterData, salaries]);

  const fetchSalaries = async () => {
    try {
      const response = await axios.get("http://localhost:4000/salary/salaries");
      console.log("Fetched Salaries:", response.data);
      setSalaries(response.data);
      setFilteredSalaries(response.data); // Initially show all salaries
    } catch (error) {
      console.error("Error fetching salaries:", error);
    }
  };

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/admin/getAllEmployee"
      );
      const data = response.data;

      // Extract unique departments and designations
      const uniqueDepartments = [
        ...new Set(data.map((employee) => employee.department)),
      ];
      const uniqueDesignations = [
        ...new Set(data.map((employee) => employee.designation)),
      ];

      setDepartments(uniqueDepartments);
      setDesignations(uniqueDesignations);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterData((prevFilterData) => ({
      ...prevFilterData,
      [name]: value,
    }));
  };

  const filterSalaries = () => {
    let filtered = salaries;

    if (filterData.department) {
      filtered = filtered.filter(
        (salary) => salary.department === filterData.department
      );
    }

    if (filterData.designation) {
      filtered = filtered.filter(
        (salary) => salary.designation === filterData.designation
      );
    }

    setFilteredSalaries(filtered);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update existing salary in the salaries table
        await axios.put(
          `http://localhost:4000/salary/salaries/${editingId}`,
          formData
        );

        // Update the salary in the workdetails table for employees with the same department and designation
        await axios.put(
          "http://localhost:4000/salary/workdetails/updateSalaryByDeptAndDesig",
          {
            department: formData.department,
            designation: formData.designation,
            salary: formData.basic_salary,
          }
        );

        setEditingId(null);
      } else {
        // Add new salary in the salaries table
        const newSalaryResponse = await axios.post(
          "http://localhost:4000/salary/salaries",
          formData
        );

        // Get the department and designation from the formData to update workdetails
        await axios.put(
          "http://localhost:4000/salary/workdetails/updateSalaryByDeptAndDesig",
          {
            department: formData.department,
            designation: formData.designation,
            salary: formData.basic_salary,
          }
        );
      }

      // Reset the form and fetch updated data
      setFormData({ department: "", designation: "", basic_salary: "" });
      fetchSalaries(); // Re-fetch all salaries after submit
    } catch (error) {
      console.error("Error saving salary:", error);
    }
  };

  const handleEdit = (salary) => {
    setFormData({
      department: salary.department,
      designation: salary.designation,
      basic_salary: salary.basic_salary,
    });
    setEditingId(salary.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/salary/salaries/${id}`);
      fetchSalaries();
    } catch (error) {
      console.error("Error deleting salary:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Salary Management</h1>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-6">
        <button
          className={`px-6 py-2 text-lg font-semibold ${
            activeTab === "salary"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-700 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("salary")}
        >
          Salary Management
        </button>
        <button
          className={`px-6 py-2 text-lg font-semibold ${
            activeTab === "employee"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-700 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("employee")}
        >
          Salary Deduction
        </button>
      </div>

      {/* Conditional rendering of content based on active tab */}
      {activeTab === "salary" && (
        <>
          {/* Form for adding/updating salaries */}
          <form className="grid grid-cols-1 gap-4 mb-6" onSubmit={handleSubmit}>
            <select
              className="border border-gray-300 rounded-lg p-2 w-full"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              className="border border-gray-300 rounded-lg p-2 w-full"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Designation</option>
              {designations.map((desig, index) => (
                <option key={index} value={desig}>
                  {desig}
                </option>
              ))}
            </select>

            <input
              className="border border-gray-300 rounded-lg p-2 w-full"
              type="number"
              name="basic_salary"
              placeholder="Basic Salary"
              value={formData.basic_salary}
              onChange={handleInputChange}
              required
            />
            <button
              className="bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600"
              type="submit"
            >
              {editingId ? "Update" : "Add"}
            </button>
          </form>

          {/* Filters Section */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <select
              className="border border-gray-300 rounded-lg p-2 w-full"
              name="department"
              value={filterData.department}
              onChange={handleFilterChange}
            >
              <option value="">Filter by Department</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              className="border border-gray-300 rounded-lg p-2 w-full"
              name="designation"
              value={filterData.designation}
              onChange={handleFilterChange}
            >
              <option value="">Filter by Designation</option>
              {designations.map((desig, index) => (
                <option key={index} value={desig}>
                  {desig}
                </option>
              ))}
            </select>
          </div>

          {/* Table to display filtered salaries */}
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Department</th>
                <th className="border border-gray-300 p-2">Designation</th>
                <th className="border border-gray-300 p-2">Basic Salary</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSalaries.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4">
                    No salaries found
                  </td>
                </tr>
              ) : (
                filteredSalaries.map((salary) => (
                  <tr key={salary.id} className="even:bg-gray-50">
                    <td className="border border-gray-300 p-2 text-center">
                      {salary.id}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {salary.department}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {salary.designation}
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {salary.basic_salary}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <button
                        className="bg-yellow-400 text-white rounded-lg px-3 py-1 mr-2 hover:bg-yellow-500"
                        onClick={() => handleEdit(salary)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white rounded-lg px-3 py-1 hover:bg-red-600"
                        onClick={() => handleDelete(salary.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}

      {/* Employee Management Tab (Placeholder for now) */}
      {activeTab === "employee" && (
        <div className="text-center">
          <SalaryDeduction />
        </div>
      )}
    </div>
  );
};

export default PayrollManagement;
