import React, { useState } from "react";

const PolicyManagement = () => {
  // State to hold policies and selected policy for editing
  const [policies, setPolicies] = useState([
    {
      id: 1,
      name: "Data Security Policy",
      status: "Active",
      lastReviewed: "2023-06-01",
      nextReview: "2024-06-01",
      compliance: 85,
    },
    {
      id: 2,
      name: "Employee Conduct Policy",
      status: "Expired",
      lastReviewed: "2022-06-01",
      nextReview: "2023-06-01",
      compliance: 70,
    },
    {
      id: 3,
      name: "Privacy Policy",
      status: "Active",
      lastReviewed: "2023-03-01",
      nextReview: "2024-03-01",
      compliance: 95,
    },
  ]);

  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [newPolicy, setNewPolicy] = useState({
    name: "",
    status: "Active",
    lastReviewed: "",
    nextReview: "",
    compliance: 0,
  });

  const [alerts, setAlerts] = useState([
    { policyId: 1, message: "Review due in 6 months." },
    { policyId: 2, message: "Policy expired - needs review." },
    { policyId: 3, message: "Review due in 3 months." },
  ]);

  // Handle creating a new policy
  const handleCreatePolicy = () => {
    const newPolicyData = {
      ...newPolicy,
      id: policies.length + 1,
      compliance: Math.max(0, Math.min(100, newPolicy.compliance)), // Ensure compliance is within 0-100
    };
    setPolicies([...policies, newPolicyData]);
    setNewPolicy({
      name: "",
      status: "Active",
      lastReviewed: "",
      nextReview: "",
      compliance: 0,
    });
    alert("Policy created successfully");
  };

  // Handle updating a policy
  const handleUpdatePolicy = () => {
    const updatedPolicies = policies.map((policy) =>
      policy.id === selectedPolicy.id ? { ...selectedPolicy } : policy
    );
    setPolicies(updatedPolicies);
    setSelectedPolicy(null);
    alert("Policy updated successfully");
  };

  // Handle deleting a policy
  const handleDeletePolicy = (id) => {
    const updatedPolicies = policies.filter((policy) => policy.id !== id);
    setPolicies(updatedPolicies);
    alert("Policy deleted successfully");
  };

  // Handle input changes for creating or editing a policy
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (selectedPolicy) {
      setSelectedPolicy({
        ...selectedPolicy,
        [name]: value,
      });
    } else {
      setNewPolicy({
        ...newPolicy,
        [name]: value,
      });
    }
  };

  const handlePolicyClick = (policy) => {
    setSelectedPolicy({ ...policy });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold mb-4">
        Policy Management Dashboard
      </h1>

      {/* Create Policy Form */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Create a New Policy</h2>
        <input
          type="text"
          name="name"
          value={newPolicy.name}
          onChange={handleInputChange}
          placeholder="Policy Name"
          className="p-2 mb-4 border rounded w-full"
        />
        <input
          type="date"
          name="lastReviewed"
          value={newPolicy.lastReviewed}
          onChange={handleInputChange}
          className="p-2 mb-4 border rounded w-full"
        />
        <input
          type="date"
          name="nextReview"
          value={newPolicy.nextReview}
          onChange={handleInputChange}
          className="p-2 mb-4 border rounded w-full"
        />
        <input
          type="number"
          name="compliance"
          value={newPolicy.compliance}
          onChange={handleInputChange}
          placeholder="Compliance Rate"
          className="p-2 mb-4 border rounded w-full"
        />
        <select
          name="status"
          value={newPolicy.status}
          onChange={handleInputChange}
          className="p-2 mb-4 border rounded w-full"
        >
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
        </select>
        <button
          onClick={handleCreatePolicy}
          className="p-2 bg-blue-500 text-white rounded w-full"
        >
          Create Policy
        </button>
      </div>

      {/* Policy Overview */}
      <div className="space-y-4 mt-6">
        <h2 className="text-2xl font-semibold">Policy Overview</h2>
        {policies.map((policy) => (
          <div
            key={policy.id}
            className={`p-4 border rounded-lg cursor-pointer ${
              policy.status === "Active" ? "bg-green-100" : "bg-red-100"
            }`}
            onClick={() => handlePolicyClick(policy)}
          >
            <h2 className="text-xl font-semibold">{policy.name}</h2>
            <p>
              Status:{" "}
              <span
                className={`font-bold ${
                  policy.status === "Active" ? "text-green-600" : "text-red-600"
                }`}
              >
                {policy.status}
              </span>
            </p>
            <p>Last Reviewed: {policy.lastReviewed}</p>
            <p>Next Review: {policy.nextReview}</p>
            <p>Compliance: {policy.compliance}%</p>
            <button
              onClick={() => handleDeletePolicy(policy.id)}
              className="mt-2 p-2 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Policy Details */}
      {selectedPolicy && (
        <div className="mt-8 p-6 border rounded-lg bg-gray-50">
          <h2 className="text-2xl font-semibold mb-4">
            {selectedPolicy.name} Details
          </h2>
          <input
            type="text"
            name="name"
            value={selectedPolicy.name}
            onChange={handleInputChange}
            className="p-2 mb-4 border rounded w-full"
          />
          <input
            type="date"
            name="lastReviewed"
            value={selectedPolicy.lastReviewed}
            onChange={handleInputChange}
            className="p-2 mb-4 border rounded w-full"
          />
          <input
            type="date"
            name="nextReview"
            value={selectedPolicy.nextReview}
            onChange={handleInputChange}
            className="p-2 mb-4 border rounded w-full"
          />
          <input
            type="number"
            name="compliance"
            value={selectedPolicy.compliance}
            onChange={handleInputChange}
            className="p-2 mb-4 border rounded w-full"
          />
          <select
            name="status"
            value={selectedPolicy.status}
            onChange={handleInputChange}
            className="p-2 mb-4 border rounded w-full"
          >
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
          </select>
          <button
            onClick={handleUpdatePolicy}
            className="p-2 bg-blue-500 text-white rounded w-full"
          >
            Update Policy
          </button>
        </div>
      )}
    </div>
  );
};

export default PolicyManagement;
