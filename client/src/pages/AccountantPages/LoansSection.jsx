import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import Documentations from "./Documentations";
import Inprogress from "./Inprogress";

const MainPage = () => {
  const [activeSection, setActiveSection] = useState("loans");
  const [activeLoan, setActiveLoan] = useState("personal");
  const [loanDetails, setLoanDetails] = useState({});
  const [editableLoan, setEditableLoan] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState("");
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const empId = localStorage.getItem("empId");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  const handleLoanClick = (loanType) => {
    setActiveLoan(loanType);
    setEditableLoan(loanDetails[loanType]);
    setIsEditing(false);
  };

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        const response = await axios.get("http://localhost:4000/salary/loans");
        const loansData = response.data;

        const loansObject = {};
        loansData.forEach((loan) => {
          loansObject[loan.loantype.toLowerCase()] = {
            id: loan.id,
            title: loan.loantype,
            ...loan.about,
          };
        });

        setLoanDetails(loansObject);
      } catch (error) {
        console.error("Error fetching loan details:", error);
      }
    };

    fetchLoanDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableLoan((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    setShowPasswordPrompt(true);
  };

  const handlePasswordSubmit = () => {
    axios
      .post(`http://localhost:4000/admin/validatePassword/${empId}`, {
        empId,
        password,
      })
      .then((response) => {
        if (response.status === 200) {
          saveChangesToBackend();
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

  const saveChangesToBackend = async () => {
    try {
      const loanId = loanDetails[activeLoan].id;
      const payload = {
        loantype: loanDetails[activeLoan].title,
        about: JSON.stringify(editableLoan),
      };

      await axios.put(`http://localhost:4000/salary/loans/${loanId}`, payload);

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
        {userRole === "Accountant" && (
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
        )}
        {userRole === "Accountant" && (
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
        )}
      </nav>

      {activeSection === "loans" && (
        <div>
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

              {userRole === "Accountant" && (
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
              )}

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

      {activeSection === "documentations" && userRole === "Accountant" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Documentations</h2>
          <Documentations />
        </div>
      )}

      {activeSection === "inprogress" && userRole === "Accountant" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">In Progress</h2>
          <Inprogress />
        </div>
      )}
    </div>
  );
};

export default MainPage;
