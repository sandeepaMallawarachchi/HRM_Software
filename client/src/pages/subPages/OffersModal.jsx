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
  const [salaryDetails, setSalaryDetails] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [bonus, setBonus] = useState(earnings?.bonus || 0);
  const [allowance, setAllowance] = useState(earnings?.allowance || 0);

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
  const hasChanges =
    selectedRole !== employee.role ||
    selectedDesignation !== employee.designation ||
    bonus !== (earnings?.bonus || 0) ||
    allowance !== (earnings?.allowance || 0);

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

  //get salary details
  useEffect(() => {
    if (employee) {
      const fetchSalaryDetails = async () => {
        try {
          const response = await axios.get(
            `http://localhost:4000/admin/getPayslip/${employee.empId}`
          );
          setSalaryDetails(response.data[0]); // Assuming you want the most recent salary details
        } catch (error) {
          console.error("Error fetching salary details:", error);
        }
      };

      fetchSalaryDetails();
    }
  }, [employee]);

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

  const handleUpdateWorkDetails = () => {
    const updateData = {};

    // Prepare data for updating work details (role, designation)
    if (selectedRole !== employee.role) {
      updateData.role = selectedRole;
    }
    if (selectedDesignation !== employee.designation) {
      updateData.designation = selectedDesignation;
    }

    // Prepare data for updating earnings (bonus, allowance)
    if (bonus !== earnings?.bonus) {
      updateData.bonus = bonus;
    }
    if (allowance !== earnings?.allowance) {
      updateData.allowance = allowance;
    }

    // Only proceed if there are updates
    if (Object.keys(updateData).length > 0) {
      // Update work details (role, designation) if necessary
      axios
        .put(
          `http://localhost:4000/employees/workDetails/${employee.empId}`,
          updateData
        )
        .then(() => {
          // After work details are updated, update earnings (bonus, allowance) if necessary
          if (updateData.bonus || updateData.allowance) {
            return axios.put(
              `http://localhost:4000/admin/updateEarnings/${employee.empId}`,
              {
                bonus: updateData.bonus || earnings.bonus, // Updated bonus value
                allowance: updateData.allowance || earnings.allowance, // Updated allowance value
              }
            );
          }
        })
        .then(() => {
          alert("Details updated successfully!");
          onClose();
        })
        .catch((error) => {
          console.error("Error updating details:", error);
          alert("Failed to update details");
        });
    } else {
      alert("No changes detected.");
    }
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

  //salary details
  useEffect(() => {
    if (employee) {
      setLoading(true);
      axios
        .get(`http://localhost:4000/admin/getEarnings/${employee.empId}`)
        .then((response) => {
          setEarnings(response.data);
        })
        .catch((error) => {
          console.error("Error fetching earnings details:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [employee]);

  if (!employee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-4xl transform transition-all duration-300 ease-in-out scale-100 hover:scale-105">
        <div className="flex items-center justify-between mb-6">
          {/* Employee Name */}
          <h2 className="text-2xl font-semibold text-gray-800">
            {employee.name}
          </h2>

          {/* Profile Photo */}
          <div className="flex-shrink-0">
            <img
              src={avatar}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading details...</p>
        ) : details ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Details - Left */}
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Personal Details
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Email", value: details.email },
                  { label: "Phone", value: details.phone },
                  { label: "Address", value: details.address },
                  { label: "Gender", value: details.gender },
                  { label: "Country", value: details.country },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <strong className="text-gray-700 w-32">{label}:</strong>
                    <p className="text-gray-600 flex-1">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Salary and Other Details - Right */}
            <div className="space-y-6">
              {/* Salary Details */}
              {salaryDetails && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    Salary Details
                  </h3>
                  {[
                    { label: "Net Pay", value: `$${salaryDetails.net_pay}` },
                    {
                      label: "Total Earnings",
                      value: `$${salaryDetails.total_earnings}`,
                    },
                    {
                      label: "Total Deductions",
                      value: `$${salaryDetails.total_deductions}`,
                    },
                    { label: "Date", value: salaryDetails.date },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <strong className="text-gray-700 w-48">{label}:</strong>
                      <p className="text-gray-600 flex-1">{value}</p>
                    </div>
                  ))}
                </div>
              )}
              {/* Earnings Details */}

              {earnings && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    Earnings Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <strong className="text-gray-700 w-32">Basic:</strong>
                      <p className="text-gray-600 flex-1">{earnings.basic}</p>
                    </div>

                    {/* Editable bonus */}
                    <div className="flex justify-between">
                      <strong className="text-gray-700 w-32">Bonus:</strong>
                      <input
                        type="number"
                        value={bonus || earnings.bonus}
                        onChange={(e) => setBonus(e.target.value)}
                        className="text-gray-600 border border-gray-300 rounded-lg py-2 px-4 w-32"
                      />
                    </div>

                    {/* Editable allowance */}
                    <div className="flex justify-between">
                      <strong className="text-gray-700 w-32">Allowance:</strong>
                      <input
                        type="number"
                        value={allowance || earnings.allowance}
                        onChange={(e) => setAllowance(e.target.value)}
                        className="text-gray-600 border border-gray-300 rounded-lg py-2 px-4 w-32"
                      />
                    </div>

                    {/* Overtime and other fields */}
                    <div className="flex justify-between">
                      <strong className="text-gray-700 w-32">Overtime:</strong>
                      <p className="text-gray-600 flex-1">
                        {earnings.overtime}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dropdowns - Bottom Left */}
            <div className="col-span-1">
              {[
                {
                  label: "Role",
                  options: roles,
                  value: selectedRole || employee.role,
                  onChange: setSelectedRole,
                },
                {
                  label: "Designation",
                  options: designations,
                  value: selectedDesignation || employee.designation, // Use the employee's designation as the default if selectedDesignation is empty
                  onChange: setSelectedDesignation,
                },
              ].map(({ label, options, value, onChange }) => (
                <div key={label} className="flex items-center mb-4">
                  <strong className="text-gray-700 w-32">{label}:</strong>
                  <select
                    className="text-gray-600 flex-1 border border-gray-300 rounded-lg py-2 px-4"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                  >
                    <option value="">{`Select ${label}`}</option>
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Buttons - Bottom Right */}
            <div className="col-span-1 flex items-center justify-end space-x-4">
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
        ) : (
          <p className="text-center text-red-500">Details not available.</p>
        )}
      </div>

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

export default Modal;
