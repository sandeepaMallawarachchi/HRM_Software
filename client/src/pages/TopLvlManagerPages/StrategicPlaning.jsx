import React, { useState } from "react";

const initialGoals = [
  {
    id: 1,
    goal: "Increase Market Share",
    description: "Expand the company’s market presence by 10%.",
    owner: "Alice Johnson",
    deadline: "2024-12-31",
    progress: 40, // in percentage
  },
  {
    id: 2,
    goal: "Improve Customer Satisfaction",
    description: "Achieve a customer satisfaction score of 90%.",
    owner: "Bob Smith",
    deadline: "2024-11-15",
    progress: 70,
  },
];

const StrategicPlanning = () => {
  const [goals, setGoals] = useState(initialGoals);
  const [goal, setGoal] = useState("");
  const [description, setDescription] = useState("");
  const [owner, setOwner] = useState("");
  const [deadline, setDeadline] = useState("");
  const [progress, setProgress] = useState(0);

  const handleAddGoal = () => {
    const newGoal = {
      id: goals.length + 1,
      goal,
      description,
      owner,
      deadline,
      progress,
    };
    setGoals([...goals, newGoal]);
    setGoal("");
    setDescription("");
    setOwner("");
    setDeadline("");
    setProgress(0);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Strategic Planning
      </h2>

      <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
        <h3 className="text-xl font-semibold mb-4">Add New Strategic Goal</h3>
        <input
          type="text"
          placeholder="Goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="text"
          placeholder="Owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="number"
          placeholder="Progress (%)"
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="border border-gray-300 rounded-lg p-3 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
          min="0"
          max="100"
        />
        <button
          onClick={handleAddGoal}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-300"
        >
          Add Goal
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-4">Current Strategic Goals</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg border border-gray-300">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Goal</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Owner</th>
              <th className="border border-gray-300 px-4 py-2">Deadline</th>
              <th className="border border-gray-300 px-4 py-2">Progress</th>
            </tr>
          </thead>
          <tbody>
            {goals.map((goal) => (
              <tr
                key={goal.id}
                className="hover:bg-gray-100 transition duration-200"
              >
                <td className="border border-gray-300 px-4 py-2">
                  {goal.goal}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {goal.description}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {goal.owner}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {goal.deadline}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {goal.progress}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StrategicPlanning;
