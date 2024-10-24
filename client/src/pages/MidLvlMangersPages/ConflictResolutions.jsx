import React, { useState } from "react";

// Sample data for conflicts
const initialConflicts = [
  {
    id: 1,
    teamMember1: "Alice",
    teamMember2: "Bob",
    conflictDescription: "Disagreement on project direction.",
    status: "Open",
    resolutionNotes: "",
  },
  {
    id: 2,
    teamMember1: "Charlie",
    teamMember2: "David",
    conflictDescription: "Communication issues.",
    status: "In Progress",
    resolutionNotes: "",
  },
];

const ConflictResolutions = () => {
  const [conflicts, setConflicts] = useState(initialConflicts);
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [resolutionNote, setResolutionNote] = useState("");

  const handleResolveConflict = (id) => {
    setConflicts((prev) =>
      prev.map((conflict) =>
        conflict.id === id
          ? { ...conflict, status: "Resolved", resolutionNotes: resolutionNote }
          : conflict
      )
    );
    setResolutionNote("");
    setSelectedConflict(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Conflict Resolutions</h2>

      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Team Member 1</th>
            <th className="border border-gray-300 px-4 py-2">Team Member 2</th>
            <th className="border border-gray-300 px-4 py-2">
              Conflict Description
            </th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {conflicts.map((conflict) => (
            <tr key={conflict.id}>
              <td className="border border-gray-300 px-4 py-2">
                {conflict.teamMember1}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {conflict.teamMember2}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {conflict.conflictDescription}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {conflict.status}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {conflict.status === "Open" && (
                  <button
                    onClick={() => setSelectedConflict(conflict.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Resolve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedConflict && (
        <div className="mt-4 border rounded p-4">
          <h3 className="text-xl font-semibold">Add Resolution Notes</h3>
          <textarea
            rows="4"
            value={resolutionNote}
            onChange={(e) => setResolutionNote(e.target.value)}
            className="border p-2 w-full"
            placeholder="Enter resolution notes..."
          />
          <button
            onClick={() => handleResolveConflict(selectedConflict)}
            className="bg-green-500 text-white px-4 py-2 mt-2 rounded"
          >
            Submit Resolution
          </button>
        </div>
      )}
    </div>
  );
};

export default ConflictResolutions;
