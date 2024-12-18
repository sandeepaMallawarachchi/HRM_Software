import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for data fetching
import { jsPDF } from "jspdf"; // Import jsPDF for generating PDFs
import Documentations from "./Documentations";

const MainPage = () => {
  const [activeSection, setActiveSection] = useState("loans"); // Default active section
  const [activeLoan, setActiveLoan] = useState("personal"); // Default active loan
  const [loanDetails, setLoanDetails] = useState({}); // State to hold loan details fetched from the backend
  const [editableLoan, setEditableLoan] = useState({}); // State to store the loan details when editing
  const [isEditing, setIsEditing] = useState(false); // State to toggle between view and edit mode

  // Function to handle section selection
  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  // Function to handle loan selection
  const handleLoanClick = (loanType) => {
    setActiveLoan(loanType);
    setEditableLoan(loanDetails[loanType]); // Set the loan details to editable state
    setIsEditing(false); // Reset edit mode
  };

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        const response = await axios.get("http://localhost:4000/salary/loans"); // Adjust backend route if needed
        const loansData = response.data;

        const loansObject = {};
        loansData.forEach((loan) => {
          loansObject[loan.loantype.toLowerCase()] = {
            id: loan.id, // Include loan ID
            title: loan.loantype, // Title of the loan
            ...loan.about, // Spread 'about' object fields
          };
        });

        setLoanDetails(loansObject);
      } catch (error) {
        console.error("Error fetching loan details:", error);
      }
    };

    fetchLoanDetails();
  }, []);

  // Function to handle editing form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableLoan((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function to toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Function to save edited loan details
  const handleSaveChanges = async () => {
    try {
      const loanId = loanDetails[activeLoan].id; // Get the loan ID

      // Prepare the payload with serialized 'about'
      const payload = {
        loantype: loanDetails[activeLoan].title, // Loan type
        about: JSON.stringify(editableLoan), // Serialize editableLoan to JSON
      };

      // Send the update request
      await axios.put(`http://localhost:4000/salary/loans/${loanId}`, payload);

      // Update state with the new details
      setLoanDetails((prevState) => ({
        ...prevState,
        [activeLoan]: { ...loanDetails[activeLoan], ...editableLoan },
      }));

      setIsEditing(false);
      alert("Loan details updated successfully!");
    } catch (error) {
      console.error("Error updating loan details:", error);
      alert("Failed to update loan details.");
    }
  };

  // Generate PDF document with loan details
  const generatePDF = () => {
    const doc = new jsPDF();
    const loan = loanDetails[activeLoan];

    doc.setFontSize(16);
    doc.text(loan.title, 20, 20);

    doc.setFontSize(12);
    doc.text(`Content: ${loan.content}`, 20, 40);
    doc.text(`Eligibility: ${loan.eligibility}`, 20, 60);
    doc.text(`Loan Limit: ${loan.loanLimit}`, 20, 80);
    doc.text(`Interest Rate: ${loan.interestRate}`, 20, 100);
    doc.text(`Repayment: ${loan.repayment}`, 20, 120);

    doc.save(`${loan.title}_Details.pdf`);
  };

  return (
    <div className="font-sans p-6 max-w-4xl mx-auto">
      {/* Navigation Bar */}
      <nav className="flex justify-around mb-8 border-b-2 pb-4">
        <button
          onClick={() => handleSectionClick("loans")}
          className={`px-6 py-2 rounded-lg transition-colors duration-300 ${
            activeSection === "loans"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Loans
        </button>
        <button
          onClick={() => handleSectionClick("documentations")}
          className={`px-6 py-2 rounded-lg transition-colors duration-300 ${
            activeSection === "documentations"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Documentations
        </button>
        <button
          onClick={() => handleSectionClick("inprogress")}
          className={`px-6 py-2 rounded-lg transition-colors duration-300 ${
            activeSection === "inprogress"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          In Progress
        </button>
      </nav>

      {/* Conditional Rendering Based on Active Section */}
      {activeSection === "loans" && (
        <div>
          {/* Loans Navigation Bar */}
          <nav className="flex justify-around mb-6 border-b-2 pb-4">
            {Object.keys(loanDetails).map((loanType) => (
              <button
                key={loanType}
                onClick={() => handleLoanClick(loanType)}
                className={`px-6 py-2 rounded-lg transition-colors duration-300 ${
                  activeLoan === loanType
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {loanDetails[loanType]?.title || loanType}
              </button>
            ))}
          </nav>

          {/* Loan Details Form Section */}
          {loanDetails[activeLoan] && (
            <section className="p-6 border-2 border-gray-200 rounded-lg bg-gray-50">
              <h2 className="text-2xl font-semibold mb-4">
                {loanDetails[activeLoan].title}
              </h2>
              <form>
                <div className="mb-4">
                  <label className="block font-medium mb-2">Content</label>
                  <textarea
                    name="content"
                    value={editableLoan.content || ""}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className="w-full p-2 border-2 border-gray-300 rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-2">Eligibility</label>
                  <input
                    type="text"
                    name="eligibility"
                    value={editableLoan.eligibility || ""}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className="w-full p-2 border-2 border-gray-300 rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-2">Loan Limit</label>
                  <input
                    type="text"
                    name="loanLimit"
                    value={editableLoan.loanLimit || ""}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className="w-full p-2 border-2 border-gray-300 rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-2">
                    Interest Rate
                  </label>
                  <input
                    type="text"
                    name="interestRate"
                    value={editableLoan.interestRate || ""}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className="w-full p-2 border-2 border-gray-300 rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-2">Repayment</label>
                  <input
                    type="text"
                    name="repayment"
                    value={editableLoan.repayment || ""}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className="w-full p-2 border-2 border-gray-300 rounded-lg"
                  />
                </div>
              </form>

              {/* Edit/Save Toggle */}
              <div className="text-center mt-6">
                {isEditing ? (
                  <button
                    onClick={handleSaveChanges}
                    className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300"
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    onClick={toggleEdit}
                    className="inline-block bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-all duration-300"
                  >
                    Edit
                  </button>
                )}
              </div>

              {/* Download PDF Section */}
              <div className="text-center mt-6">
                <button
                  onClick={generatePDF}
                  className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300"
                >
                  Download Loan Details (PDF)
                </button>
              </div>
            </section>
          )}
        </div>
      )}

      {activeSection === "documentations" && (
        <div>
          {/* Documentation Section */}
          <h2 className="text-2xl font-semibold mb-4">Documentations</h2>
          <Documentations />
        </div>
      )}

      {activeSection === "inprogress" && (
        <div>
          {/* In Progress Section */}
          <h2 className="text-2xl font-semibold mb-4">In Progress</h2>
          <p>Details about in-progress items will be displayed here.</p>
        </div>
      )}
    </div>
  );
};

export default MainPage;
