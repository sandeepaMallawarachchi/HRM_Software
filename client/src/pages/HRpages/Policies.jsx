import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PolicyManagement from "./PolicyManagement"; // Import the PolicyManagement component

const PolicyTable = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const empId = localStorage.getItem("empId");
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [showPolicyManagement, setShowPolicyManagement] = useState(false); // State for PolicyManagement component
  const navigate = useNavigate(); // React Router hook for navigation

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

  // Handle password validation and navigation
  const handlePasswordSubmit = () => {
    axios
      .post(`https://global-hrm-mobile-server.vercel.app/admin/validatePassword/${empId}`, {
        password: password,
      })
      .then((response) => {
        if (response.status === 200) {
          setShowPasswordPrompt(false);
          setPassword("");
          // Show PolicyManagement component after successful password validation
          setShowPolicyManagement(true);
        }
      })
      .catch((error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          alert("Incorrect password. Please try again.");
        } else {
          alert("Error validating password. Please try again later.");
        }
      });
  };

  // Show password prompt before navigating to PolicyManagement
  const handleMoreOptions = () => {
    setShowPasswordPrompt(true);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Policy View Table</h1>

      {/* Conditionally render the Policy Management component */}
      {showPolicyManagement ? (
        <PolicyManagement /> // Show PolicyManagement when validated
      ) : (
        <>
          {/* Display List of Policies */}
          <div>
            {loading ? (
              <p>Loading policies...</p>
            ) : (
              <>
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">Title</th>
                      <th className="border px-4 py-2">Department</th>
                      <th className="border px-4 py-2">Level</th>
                      <th className="border px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {policies.map((policy) => (
                      <tr key={policy.policy_id}>
                        <td className="border px-4 py-2">
                          {policy.policy_title}
                        </td>
                        <td className="border px-4 py-2">
                          {policy.department}
                        </td>
                        <td className="border px-4 py-2">
                          {policy.policy_level}
                        </td>
                        <td className="border px-4 py-2">
                          {policy.approval_status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* More Options Button */}
                <div className="mt-4">
                  <button
                    onClick={handleMoreOptions}
                    className="bg-blue-500 text-white p-2 rounded"
                  >
                    More Options
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Password Prompt */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-md transform transition-all duration-300 ease-in-out scale-100 hover:scale-105">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Enter Password to Confirm
            </h3>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <div className="mt-4 text-center space-x-4">
              <button
                className="bg-red-500 text-white px-8 py-3 rounded-full shadow-md hover:bg-red-600 transition-all duration-300"
                onClick={() => setShowPasswordPrompt(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-8 py-3 rounded-full shadow-md hover:bg-blue-600 transition-all duration-300"
                onClick={handlePasswordSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyTable;
