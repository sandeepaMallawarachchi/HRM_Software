import React, { useState, useEffect } from "react";
import axios from "axios";
import defaultAvatar from "../../images/avatar.png";

const Modal = ({ employee, onClose }) => {
  const [details, setDetails] = useState(null);
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const empId = localStorage.getItem("empId");

  // Fetch employee personal details and work details
  useEffect(() => {
    if (employee) {
      setLoading(true);
      axios
        .get(
          `http://localhost:4000/employees/getPersonalDetails/${employee.empId}`
        )
        .then((response) => {
          setDetails(response.data);
          setSelectedRole(response.data.role || "");
          setSelectedDesignation(response.data.designation || "");
        })
        .catch((error) => {
          console.error("Error fetching personal details:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [employee]);

  // Fetch all roles and designations
  useEffect(() => {
    axios
      .get("http://localhost:4000/admin/getAllEmployee")
      .then((response) => {
        const employees = response.data;
        const roles = [...new Set(employees.map((emp) => emp.role))];
        const designations = [
          ...new Set(employees.map((emp) => emp.designation)),
        ];
        setRoles(roles);
        setDesignations(designations);
      })
      .catch((error) => {
        console.error("Error fetching roles and designations:", error);
      });
  }, []);

  // Handle password validation and update
  const handlePasswordSubmit = () => {
    axios
      .post(`http://localhost:4000/admin/validatePassword/${empId}`, {
        empId: employee.empId,
        password: password,
      })
      .then((response) => {
        if (response.status === 200) {
          handleUpdateWorkDetails();
          setShowPasswordPrompt(false);
          setPassword("");
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

  // Update role and designation
  const handleUpdateWorkDetails = () => {
    axios
      .put(`http://localhost:4000/employees/workDetails/${employee.empId}`, {
        designation: selectedDesignation,
        role: selectedRole,
      })
      .then(() => {
        alert("Work details updated successfully!");
        onClose();
      })
      .catch((error) => {
        console.error("Error updating work details:", error);
        alert("Failed to update work details");
      });
  };

  useEffect(() => {
    if (employee) {
      const fetchProfilePic = async () => {
        try {
          const response = await axios.get(
            `http://localhost:4000/employees/getProfileImage/${employee.empId}`
          );
          if (response.data.imageUrl) {
            setAvatar(response.data.imageUrl);
          }
        } catch (err) {
          console.error("Error fetching employee profile pic:", err);
        }
      };
      fetchProfilePic();
    }
  }, [employee]);

  if (!employee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-lg transform transition-all duration-300 ease-in-out scale-100 hover:scale-105">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Employee Details: {employee.name}
        </h2>
        {loading ? (
          <div className="text-center text-gray-500">Loading details...</div>
        ) : details ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between">
              <strong className="text-gray-700 w-32">Email:</strong>
              <p className="text-gray-600 flex-1">{details.email}</p>
            </div>
            <div className="flex flex-wrap items-center justify-between">
              <strong className="text-gray-700 w-32">Phone:</strong>
              <p className="text-gray-600 flex-1">{details.phone}</p>
            </div>
            <div className="flex flex-wrap items-center justify-between">
              <strong className="text-gray-700 w-32">Address:</strong>
              <p className="text-gray-600 flex-1">{details.address}</p>
            </div>
            <div className="flex flex-wrap items-center justify-between">
              <strong className="text-gray-700 w-32">Gender:</strong>
              <p className="text-gray-600 flex-1">{details.gender}</p>
            </div>
            <div className="flex flex-wrap items-center justify-between">
              <strong className="text-gray-700 w-32">Country:</strong>
              <p className="text-gray-600 flex-1">{details.country}</p>
            </div>
            <div className="mt-4 flex justify-center">
              <img
                src={avatar}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
              />
            </div>
            <div className="space-y-4 mt-6">
              <div className="flex flex-wrap items-center justify-between">
                <strong className="text-gray-700 w-32">Role:</strong>
                <select
                  className="text-gray-600 flex-1 border border-gray-300 rounded-lg py-2 px-4"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap items-center justify-between">
                <strong className="text-gray-700 w-32">Designation:</strong>
                <select
                  className="text-gray-600 flex-1 border border-gray-300 rounded-lg py-2 px-4"
                  value={selectedDesignation}
                  onChange={(e) => setSelectedDesignation(e.target.value)}
                >
                  <option value="">Select Designation</option>
                  {designations.map((designation) => (
                    <option key={designation} value={designation}>
                      {designation}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-500">Details not available.</div>
        )}
        <div className="mt-6 text-center space-x-4">
          <button
            className="bg-red-500 text-white px-8 py-3 rounded-full shadow-md hover:bg-red-600 transition-all duration-300"
            onClick={onClose}
          >
            Close
          </button>
          <button
            disabled={!selectedRole || !selectedDesignation}
            className={`px-8 py-3 rounded-full shadow-md transition-all duration-300 ${
              !selectedRole || !selectedDesignation
                ? "bg-blue-300 text-gray-200 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={() => setShowPasswordPrompt(true)}
          >
            Update
          </button>
        </div>
      </div>
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

export default Modal;
