import React, { useState, useEffect } from "react";
import axios from "axios";

const DecisionSupport = () => {
  const [decisions, setDecisions] = useState([]);
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [responseReason, setResponseReason] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/admin/getDecisions"
        );
        // Assuming response.data is an array of employee decisions
        const filteredDecisions = response.data.filter(
          (decision) => decision.role === "Top Lvl Manager"
        );
        setDecisions(filteredDecisions);
      } catch (error) {
        console.error("Error fetching decision data:", error);
      }
    };
    fetchData();
  }, []);

  const handleDecisionSelect = (decision) => {
    setSelectedDecision(decision);
    setResponseReason(decision.reason); // Pre-fill the reason for editing
  };

  const handleAcceptDecision = () => {
    if (selectedDecision) {
      const updatedDecision = {
        ...selectedDecision,
        status: "Accepted",
        reason: responseReason,
      };
      setDecisions((prevDecisions) =>
        prevDecisions.map((dec) =>
          dec.id === updatedDecision.id ? updatedDecision : dec
        )
      );
      alert(`Decision accepted: ${updatedDecision.decision}`);
      setSelectedDecision(null);
      setResponseReason("");
    }
  };

  const handleRejectDecision = () => {
    if (selectedDecision) {
      const updatedDecision = {
        ...selectedDecision,
        status: "Rejected",
        reason: responseReason,
      };
      setDecisions((prevDecisions) =>
        prevDecisions.map((dec) =>
          dec.id === updatedDecision.id ? updatedDecision : dec
        )
      );
      alert(`Decision rejected: ${updatedDecision.decision}`);
      setSelectedDecision(null);
      setResponseReason("");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Decision Support Dashboard
      </h1>

      {/* Decision List */}
      <div className="mb-6">
        <h2 className="text-xl mb-4">Decisions Made by Top-Level Managers:</h2>
        <ul className="space-y-2">
          {decisions.map((decision) => (
            <li
              key={decision.id}
              className={`cursor-pointer hover:bg-gray-200 p-2 rounded ${
                decision.status === "Accepted"
                  ? "bg-green-100"
                  : decision.status === "Rejected"
                  ? "bg-red-100"
                  : ""
              }`}
              onClick={() => handleDecisionSelect(decision)}
            >
              <strong>{decision.department}</strong> (Role: {decision.role}):{" "}
              {decision.decision} (Status: {decision.status})
              <br />
              <span className="text-sm text-gray-600">
                Date: {decision.date}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Selected Decision Details */}
      {selectedDecision && (
        <div className="mt-4 bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-lg font-semibold">Selected Decision:</h3>
          <p>
            <strong>Department:</strong> {selectedDecision.department}
          </p>
          <p>
            <strong>Role:</strong> {selectedDecision.role}
          </p>
          <p>
            <strong>Decision:</strong> {selectedDecision.decision}
          </p>
          <p>
            <strong>Status:</strong> {selectedDecision.status}
          </p>

          <textarea
            className="mt-4 w-full p-2 border rounded"
            rows="4"
            value={responseReason}
            onChange={(e) => setResponseReason(e.target.value)}
            placeholder="Provide reason for your response..."
          ></textarea>

          <div className="mt-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 mr-2 rounded hover:bg-blue-600 transition duration-200"
              onClick={handleAcceptDecision}
            >
              Accept Decision
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
              onClick={handleRejectDecision}
            >
              Reject Decision
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecisionSupport;
