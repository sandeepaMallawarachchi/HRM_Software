import React, { useState } from "react";

const Support = ({ onClose }) => {
  const [formData, setFormData] = useState({
    subject: "",
    email: "", // Keeping this state for the input
    department: "", // Added department state
    otherSubject: "", // Added state for 'Other' subject input
    message: "",
  });

  // Sample departments
  const departments = ["HR", "Finance", "IT", "Sales", "Marketing"];

  // Sample subjects
  const subjects = [
    "Financial",
    "Health Care",
    "IT Solution",
    "Job Progress",
    "Loan Services",
    "Other",
  ];

  // Retrieve empId from localStorage
  const empId = localStorage.getItem("empId");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!empId) {
      console.error("Employee ID not found");
      return;
    }

    const supportData = {
      empId,
      ...formData,
    };

    console.log("Form Data:", supportData);

    try {
      const response = await fetch(
        `https://global-hrm-mobile-server.vercel.app/employees/support/${empId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(supportData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Support request submitted:", data);
        alert("Support request submitted");
        onClose(); // Close the modal or support form
      } else {
        console.error("Error submitting form:", data);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 w-1/3 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email} // Allowing the user to enter their email
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Subject</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((subject, index) => (
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          {formData.subject === "Other" && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Please specify:
              </label>
              <input
                type="text"
                name="otherSubject"
                value={formData.otherSubject}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter your subject"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter your message"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="flex justify-start space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-[20px]"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 hover:underline text-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Support;
