import React, { useState } from "react";

// Sample data for departments and policies
const departments = ["HR", "Finance", "IT", "Sales", "Marketing"];

const PolicyManagement = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0]);
  const [policyTitle, setPolicyTitle] = useState("");
  const [policyContent, setPolicyContent] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Simulate approval process
    setApprovalStatus("Pending approval from Director Board and CEO.");

    // Here, you would normally send the policy to the server for approval
    console.log("Submitting policy:", {
      policyTitle,
      policyContent,
      selectedDepartment,
    });
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Policy Management</h1>

      {/* Department Navigation */}
      <div className="mb-4">
        <label className="mr-2">Select Department:</label>
        <select
          value={selectedDepartment}
          onChange={handleDepartmentChange}
          className="border border-gray-300 p-2 rounded"
        >
          {departments.map((department, index) => (
            <option key={index} value={department}>
              {department}
            </option>
          ))}
        </select>
      </div>

      {/* Policy Creation Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label className="block mb-1">Policy Title:</label>
          <input
            type="text"
            value={policyTitle}
            onChange={(e) => setPolicyTitle(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Policy Content:</label>
          <textarea
            value={policyContent}
            onChange={(e) => setPolicyContent(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
            rows="5"
            required
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Submit Policy for Approval
        </button>
      </form>

      {/* Approval Status */}
      {approvalStatus && (
        <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 border border-yellow-400 rounded">
          {approvalStatus}
        </div>
      )}

      {/* Subsections for policy management */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Policy Subsections:</h2>
        <ul className="list-disc list-inside">
          <li>
            <a href="/policy/review" className="text-blue-500">
              Review Policies
            </a>
          </li>
          <li>
            <a href="/policy/history" className="text-blue-500">
              Policy History
            </a>
          </li>
          <li>
            <a href="/policy/archives" className="text-blue-500">
              Archived Policies
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PolicyManagement;
