import React, { useState, useEffect } from "react";
import axios from "axios";

const PreApprovals = () => {
  const [preApprovals, setPreApprovals] = useState([]);
  const [filteredPreApprovals, setFilteredPreApprovals] = useState([]);
  const [formData, setFormData] = useState({
    department: "",
    position: "",
    status: "",
    cv: null,
    name: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ name: "", department: "" });
  const [departments, setDepartments] = useState([]);

  // Fetch all pre-approval records
  const fetchPreApprovals = async () => {
    try {
      const response = await axios.get("https://global-hrm-mobile-server.vercel.app/cv/preApprovals");
      setPreApprovals(response.data);
      setFilteredPreApprovals(response.data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  // Fetch all departments
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        "https://global-hrm-mobile-server.vercel.app/admin/getAllDepartments"
      );
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    fetchPreApprovals();
    fetchDepartments();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Apply filters to the pre-approvals list
  const applyFilters = () => {
    let filtered = preApprovals;

    if (filters.name) {
      filtered = filtered.filter((record) =>
        record.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.department) {
      filtered = filtered.filter((record) =>
        record.department
          .toLowerCase()
          .includes(filters.department.toLowerCase())
      );
    }

    setFilteredPreApprovals(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, preApprovals]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    for (const key in formData) {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    }

    try {
      if (editingId) {
        await axios.put(
          `https://global-hrm-mobile-server.vercel.app/cv/preApprovals/${editingId}`,
          data
        );
        setEditingId(null);
      } else {
        await axios.post("https://global-hrm-mobile-server.vercel.app/cv/preApprovals", data);
      }
      setFormData({
        department: "",
        position: "",
        status: "",
        cv: null,
        name: "",
      });
      fetchPreApprovals();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Handle editing a record
  const handleEdit = (record) => {
    setEditingId(record.id);
    setFormData({
      department: record.department || "",
      position: record.position,
      status: record.status,
      cv: null,
      name: record.name || "",
    });
  };

  // Handle deleting a record
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://global-hrm-mobile-server.vercel.app/cv/preApprovals/${id}`);
      fetchPreApprovals();
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Pre-Approvals Management
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-md"
      >
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter Name"
          className="border rounded p-2 w-full"
        />

        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
          className="border rounded p-2 w-full"
        >
          <option value="">Select Department</option>
          {departments.map((dept, index) => (
            <option key={index} value={dept.department}>
              {dept.department}
            </option>
          ))}
        </select>

        <select
          name="position"
          value={formData.position}
          onChange={handleChange}
          required
          className="border rounded p-2 w-full"
        >
          <option value="">Select Position</option>
          <option value="Intern">Intern</option>
          <option value="Trainee">Trainee</option>
        </select>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="border rounded p-2 w-full"
        >
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <input
          type="file"
          name="cv"
          onChange={handleChange}
          required={!editingId}
          className="border rounded p-2 w-full"
        />
        <button
          type="submit"
          className="col-span-1 sm:col-span-2 bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
        >
          {editingId ? "Update" : "Submit"}
        </button>
      </form>

      <div className="flex space-x-4 my-6">
        <input
          type="text"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          placeholder="Search by Name"
          className="border rounded p-2 w-1/3"
        />

        <select
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
          className="border rounded p-2 w-1/3"
        >
          <option value="">Select Department</option>
          {departments.map((dept, index) => (
            <option key={index} value={dept.department}>
              {dept.department}
            </option>
          ))}
        </select>
      </div>

      <table className="table-auto w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Department</th>
            <th className="px-4 py-2">Position</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">CV</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPreApprovals.map((record) => (
            <tr key={record.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 text-center">{record.name}</td>
              <td className="px-4 py-2 text-center">{record.department}</td>
              <td className="px-4 py-2 text-center">{record.position}</td>
              <td className="px-4 py-2 text-center">{record.status}</td>
              <td className="px-4 py-2 text-center">
                {record.cv ? (
                  <a
                    href={record.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View CV
                  </a>
                ) : (
                  <span className="text-gray-500">No CV</span>
                )}
              </td>
              <td className="px-4 py-2 text-center space-x-2">
                <button
                  onClick={() => handleEdit(record)}
                  className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(record.id)}
                  className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PreApprovals;
