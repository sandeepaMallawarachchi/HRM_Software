import React, { useState, useEffect } from "react";

// Mock data for engagement metrics and feedback
const mockEngagementData = {
  metrics: {
    overallEngagement: 75,
    participationRate: 60,
    employeeSatisfaction: 80,
  },
  feedback: [
    {
      id: 1,
      employeeName: "Alice",
      comment: "I love the team spirit in our department!",
      date: "2024-10-01",
    },
    {
      id: 2,
      employeeName: "Bob",
      comment: "More team-building activities would be great.",
      date: "2024-10-05",
    },
  ],
  initiatives: [
    { id: 1, name: "Monthly Team Outings", status: "Proposed" },
    { id: 2, name: "Quarterly Feedback Sessions", status: "In Progress" },
  ],
};

const CultureandEngagement = () => {
  // Initialize the state with a structure to avoid accessing undefined properties
  const [engagementData, setEngagementData] = useState({
    metrics: {
      overallEngagement: 0,
      participationRate: 0,
      employeeSatisfaction: 0,
    },
    feedback: [],
    initiatives: [],
  });

  useEffect(() => {
    // Simulate fetching data from an API
    setEngagementData(mockEngagementData);
  }, []);

  const handleInitiativeUpdate = (initiative) => {
    // Logic to update the status of an initiative
    alert(`Updating status for initiative: ${initiative.name}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Culture and Engagement
      </h1>

      {/* Engagement Metrics */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Engagement Metrics</h2>
        <ul className="list-disc ml-6">
          <li className="text-lg">
            Overall Engagement:{" "}
            <span className="font-bold">
              {engagementData.metrics.overallEngagement}%
            </span>
          </li>
          <li className="text-lg">
            Participation Rate:{" "}
            <span className="font-bold">
              {engagementData.metrics.participationRate}%
            </span>
          </li>
          <li className="text-lg">
            Employee Satisfaction:{" "}
            <span className="font-bold">
              {engagementData.metrics.employeeSatisfaction}%
            </span>
          </li>
        </ul>
      </div>

      {/* Employee Feedback */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Employee Feedback</h2>
        <ul className="space-y-2">
          {engagementData.feedback.map((feedback) => (
            <li
              key={feedback.id}
              className="p-4 border border-gray-300 rounded bg-gray-100"
            >
              <p className="font-semibold">{feedback.employeeName}</p>
              <p className="italic">"{feedback.comment}"</p>
              <p className="text-sm text-gray-500">{feedback.date}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Initiatives Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Culture Initiatives</h2>
        <ul className="space-y-2">
          {engagementData.initiatives.map((initiative) => (
            <li
              key={initiative.id}
              className="p-4 border border-gray-300 rounded bg-gray-100 flex justify-between items-center"
            >
              <span>{initiative.name}</span>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                onClick={() => handleInitiativeUpdate(initiative)}
              >
                Update Status
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CultureandEngagement;
