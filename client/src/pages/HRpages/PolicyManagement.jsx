import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PolicyManagement = () => {
  const [policies, setPolicies] = useState([]);
  const [newPolicy, setNewPolicy] = useState({
    policy_title: "",
    policy_description: "",
    policy_type: "HR",
    department: "HR",
    policy_level: "Company-wide",
    effective_date: "",
    created_by: "",
    approval_status: "Pending",
    attachments: "",
    is_active: 1,
  });
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // To control the modal visibility
  const [modalPolicyDescription, setModalPolicyDescription] = useState("");
  const navigate = useNavigate(); // React Router hook for navigation

  // Function to navigate back to the PolicyTable
  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page (PolicyTable in this case)
  };
  // Fetch all policies from the backend
  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://global-hrm-mobile-server.vercel.app/admin/getPolicies"
      );
      setPolicies(response.data);
    } catch (error) {
      console.error("Error fetching policies", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // Handle form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (selectedPolicy) {
      setSelectedPolicy({ ...selectedPolicy, [name]: value });
    } else {
      setNewPolicy({ ...newPolicy, [name]: value });
    }
  };

  // Show policy description in modal
  const handlePolicyTitleClick = (policyDescription) => {
    setModalPolicyDescription(policyDescription);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalPolicyDescription("");
  };

  // Create a new policy
  const handleCreatePolicy = async () => {
    try {
      await axios.post("https://global-hrm-mobile-server.vercel.app/admin/addPolicy", newPolicy);
      fetchPolicies();
      setNewPolicy({
        policy_title: "",
        policy_description: "",
        policy_type: "HR",
        department: "HR",
        policy_level: "Company-wide",
        effective_date: "",
        created_by: "",
        approval_status: "Pending",
        attachments: "",
        is_active: 1,
      });
      alert("Policy created successfully");
    } catch (error) {
      console.error("Error creating policy", error);
      alert("Failed to create policy");
    }
  };

  // Update an existing policy
  const handleUpdatePolicy = async () => {
    try {
      await axios.put(
        `https://global-hrm-mobile-server.vercel.app/admin/updatePolicy/${selectedPolicy.policy_id}`,
        selectedPolicy
      );
      fetchPolicies();
      setSelectedPolicy(null);
      alert("Policy updated successfully");
    } catch (error) {
      console.error("Error updating policy", error);
      alert("Failed to update policy");
    }
  };

  // Delete a policy
  const handleDeletePolicy = async (id) => {
    try {
      await axios.delete(`https://global-hrm-mobile-server.vercel.app/admin/deletePolicy/${id}`);
      fetchPolicies();
      alert("Policy deleted successfully");
    } catch (error) {
      console.error("Error deleting policy", error);
      alert("Failed to delete policy");
    }
  };

  // Handle selecting a policy for editing
  const handleSelectPolicy = (policy) => {
    setSelectedPolicy(policy);
    setNewPolicy({ ...policy });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Policy Management Dashboard</h1>
      <button
        onClick={handleGoBack}
        className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
      >
        Back to Policy Table
      </button>
      {/* Display List of Policies */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Policies</h2>
        {loading ? (
          <p>Loading policies...</p>
        ) : (
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Department</th>
                <th className="border px-4 py-2">Level</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy.policy_id}>
                  <td className="border px-4 py-2">
                    <button
                      className="text-blue-500"
                      onClick={() =>
                        handlePolicyTitleClick(policy.policy_description)
                      }
                    >
                      {policy.policy_title}
                    </button>
                  </td>
                  <td className="border px-4 py-2">{policy.department}</td>
                  <td className="border px-4 py-2">{policy.policy_level}</td>
                  <td className="border px-4 py-2">{policy.approval_status}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="text-blue-500"
                      onClick={() => handleSelectPolicy(policy)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 ml-2"
                      onClick={() => handleDeletePolicy(policy.policy_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create or Update Policy Form */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          {selectedPolicy ? "Update Policy" : "Create New Policy"}
        </h2>
        <input
          type="text"
          name="policy_title"
          value={
            selectedPolicy
              ? selectedPolicy.policy_title
              : newPolicy.policy_title
          }
          onChange={handleInputChange}
          placeholder="Policy Title"
          className="p-2 mb-4 border rounded w-full"
        />
        <textarea
          name="policy_description"
          value={
            selectedPolicy
              ? selectedPolicy.policy_description
              : newPolicy.policy_description
          }
          onChange={handleInputChange}
          placeholder="Policy Description"
          className="p-2 mb-4 border rounded w-full"
        ></textarea>
        <select
          name="policy_type"
          value={
            selectedPolicy ? selectedPolicy.policy_type : newPolicy.policy_type
          }
          onChange={handleInputChange}
          className="p-2 mb-4 border rounded w-full"
        >
          <option value="HR">HR</option>
          <option value="IT">IT</option>
          <option value="Finance">Finance</option>
          <option value="General">General</option>
        </select>
        <select
          name="department"
          value={
            selectedPolicy ? selectedPolicy.department : newPolicy.department
          }
          onChange={handleInputChange}
          className="p-2 mb-4 border rounded w-full"
        >
          <option value="HR">HR</option>
          <option value="IT">IT</option>
          <option value="Finance">Finance</option>
          <option value="Sales">Sales</option>
          <option value="Operations">Operations</option>
          <option value="Marketing">Marketing</option>
          <option value="R&D">R&D</option>
        </select>
        <select
          name="policy_level"
          value={
            selectedPolicy
              ? selectedPolicy.policy_level
              : newPolicy.policy_level
          }
          onChange={handleInputChange}
          className="p-2 mb-4 border rounded w-full"
        >
          <option value="Company-wide">Company-wide</option>
          <option value="Managerial">Managerial</option>
          <option value="Employee">Employee</option>
        </select>
        <input
          type="date"
          name="effective_date"
          value={
            selectedPolicy
              ? selectedPolicy.effective_date
              : newPolicy.effective_date
          }
          onChange={handleInputChange}
          className="p-2 mb-4 border rounded w-full"
        />
        <input
          type="text"
          name="created_by"
          value={
            selectedPolicy ? selectedPolicy.created_by : newPolicy.created_by
          }
          onChange={handleInputChange}
          placeholder="Created By"
          className="p-2 mb-4 border rounded w-full"
        />
        <select
          name="approval_status"
          value={
            selectedPolicy
              ? selectedPolicy.approval_status
              : newPolicy.approval_status
          }
          onChange={handleInputChange}
          className="p-2 mb-4 border rounded w-full"
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <input
          type="file"
          name="attachments"
          onChange={handleInputChange}
          className="p-2 mb-4 border rounded w-full"
        />
        <select
          name="is_active"
          value={
            selectedPolicy ? selectedPolicy.is_active : newPolicy.is_active
          }
          onChange={handleInputChange}
          className="p-2 mb-4 border rounded w-full"
        >
          <option value={1}>Active</option>
          <option value={0}>Inactive</option>
        </select>
        <button
          type="button"
          onClick={selectedPolicy ? handleUpdatePolicy : handleCreatePolicy}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          {selectedPolicy ? "Update Policy" : "Create Policy"}
        </button>
      </div>

      {/* Policy Description Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">Policy Description</h3>
            <p>{modalPolicyDescription}</p>
            <button
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyManagement;
