import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";

const EmployeeRegistration = () => {
  const [formStep, setFormStep] = useState(1);
  const [loginFormData, setLoginFormData] = useState({
    empId: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    passwordError: "",
    confirmPasswordError: "",
    roleError: "",
  });

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;
    return regex.test(password);
  };

  const [workFormData, setWorkFormData] = useState({
    workEmail: "",
    workPhone: "",
    department: "",
    location: "",
    designation: "",
    supervisor: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (formStep === 1) {
      setLoginFormData({ ...loginFormData, [name]: value });
    } else if (formStep === 2) {
      setWorkFormData({ ...workFormData, [name]: value });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    let passwordError = "";
    let confirmPasswordError = "";
    let roleError = "";

    // Password validation
    if (!validatePassword(loginFormData.password)) {
      passwordError =
        "Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character.";
    }

    // Confirm password validation
    if (loginFormData.password !== loginFormData.confirmPassword) {
      confirmPasswordError = "Passwords do not match.";
    }

    // Role validation
    if (!loginFormData.role) {
      roleError = "Please select a role.";
    }

    if (passwordError || confirmPasswordError || roleError) {
      setErrors({ passwordError, confirmPasswordError, roleError });
      return; // Stop form submission if validation fails
    }

    try {
      const response = await fetch(
        "http://localhost:4000/employees/loginCredentials",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginFormData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Adding login credentials successful:", data);
        alert("Login credentials submitted successfully");
        setFormStep(2);
      } else {
        console.error("Login credentials submission failed:", data.error);
        alert("Login credentials submission failed");
      }
    } catch (error) {
      console.error("Error submitting login form:", error);
      alert("Error submitting login form");
    }
  };

  const handleWorkSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:4000/employees/workDetails",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(workFormData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Adding work details successful:", data);
        alert("Work details submitted successfully");
      } else {
        console.error("Work details submission failed:", data.error);
        alert("Work details submission failed");
      }
    } catch (error) {
      console.error("Error submitting work details:", error);
      alert("Error submitting work details");
    }
  };

  return (
    <div className="mt-10 bg-[#eaeaea] p-6 rounded-lg mx-10">
      <CSSTransition
        in={formStep === 1}
        timeout={300}
        classNames="form-transition"
        unmountOnExit
      >
        <div>
          <h2 className="text-2xl mb-4 text-gray-700">Login Credentials</h2>
          <form
            onSubmit={handleLoginSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label className="block mb-1 text-gray-500">Employee Id</label>
              <input
                required
                name="empId"
                value={loginFormData.empId}
                onChange={handleChange}
                className="border-none rounded-md p-2 w-full"
                placeholder="Enter your employee Id"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-500">Email</label>
              <input
                required
                name="email"
                value={loginFormData.email}
                onChange={handleChange}
                className="border-none rounded-md p-2 w-full"
                placeholder="Enter your email"
                type="email"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-500">Password</label>
              <input
                required
                name="password"
                value={loginFormData.password}
                onChange={handleChange}
                className="border-none rounded-md p-2 w-full"
                placeholder="Enter your password"
                type="password"
              />
              {errors.passwordError && (
                <p className="text-red-600 mt-1">{errors.passwordError}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-gray-500">
                Confirm Password
              </label>
              <input
                required
                name="confirmPassword"
                value={loginFormData.confirmPassword}
                onChange={handleChange}
                className="border-none rounded-md p-2 w-full"
                placeholder="Confirm your password"
                type="password"
              />
              {errors.confirmPasswordError && (
                <p className="text-red-600 mt-1">
                  {errors.confirmPasswordError}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block mb-1 text-gray-500">Role</label>
              <select
                required
                name="role"
                value={loginFormData.role}
                onChange={handleChange}
                className="border-none rounded-md p-2 w-full"
              >
                <option value="">Select Role</option>
                <option value="Employee">Employee</option>
                <option value="Team Leader">Team Leader</option>
                <option value="HR">HR</option>
                <option value="Mid Lvl Manager">Mid Lvl Manager</option>
                <option value="Top Lvl Manager">Top Lvl Manager</option>
                <option value="Ceo">Ceo</option>
              </select>
              {errors.roleError && (
                <p className="text-red-600 mt-1">{errors.roleError}</p>
              )}
            </div>

            <div className="col-span-2 flex justify-start mt-6">
              <button
                type="submit"
                className="w-32 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px]"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </CSSTransition>

      <CSSTransition
        in={formStep === 2}
        timeout={300}
        classNames="form-transition"
        unmountOnExit
      >
        <div>
          <h2 className="text-2xl mb-4 text-gray-700">Work Details</h2>
          <form
            onSubmit={handleWorkSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label className="block mb-1 text-gray-500">Work Email</label>
              <input
                required
                name="workEmail"
                value={workFormData.workEmail}
                onChange={handleChange}
                className="border-none rounded-md p-2 w-full"
                placeholder="Enter Work Email"
                type="email"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-500">Work Phone</label>
              <input
                required
                name="workPhone"
                value={workFormData.workPhone}
                onChange={handleChange}
                className="border-none rounded-md p-2 w-full"
                placeholder="Enter Work Phone"
                type="tel"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-500">Department</label>
              <select
                name="department"
                value={workFormData.department}
                onChange={handleChange}
                className="border-none rounded-md p-2 w-full"
              >
                <option value="">Select Department</option>
                <option value="IT">IT</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
                <option value="Financial">Financial</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-gray-500">Designation</label>
              <input
                required
                name="designation"
                value={workFormData.designation}
                onChange={handleChange}
                className="border-none rounded-md p-2 w-full"
                placeholder="Enter designation"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-500">Location</label>
              <input
                required
                name="location"
                value={workFormData.location}
                onChange={handleChange}
                className="border-none rounded-md p-2 w-full"
                placeholder="Enter location"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-500">Supervisor</label>
              <input
                required
                name="supervisor"
                value={workFormData.supervisor}
                onChange={handleChange}
                className="border-none rounded-md p-2 w-full"
                placeholder="Enter your supervisor"
              />
            </div>

            <div className="col-span-2 flex justify-start mt-6">
              <button
                type="submit"
                className="w-32 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px]"
              >
                Submit
              </button>
              <button
                type="button"
                className="w-32 hover:underline text-gray-500 px-4 py-2"
                onClick={() => setFormStep(1)}
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </CSSTransition>
    </div>
  );
};

export default EmployeeRegistration;
