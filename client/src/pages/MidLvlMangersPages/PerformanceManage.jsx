import React, { useState } from "react";

const PerformanceManage = () => {
  const [teamLeaders, setTeamLeaders] = useState([
    {
      id: 1,
      name: "John Doe",
      team: "Development",
      performance: 80,
      email: "john.doe@example.com",
      notes: [],
    },
    {
      id: 2,
      name: "Jane Smith",
      team: "Marketing",
      performance: 90,
      email: "jane.smith@example.com",
      notes: [],
    },
    {
      id: 3,
      name: "Alice Johnson",
      team: "Sales",
      performance: 75,
      email: "alice.johnson@example.com",
      notes: [],
    },
    {
      id: 4,
      name: "Bob Brown",
      team: "Support",
      performance: 85,
      email: "bob.brown@example.com",
      notes: [],
    },
  ]);

  const [selectedLeader, setSelectedLeader] = useState(null);
  const [emailContent, setEmailContent] = useState("");
  const [performanceFilter, setPerformanceFilter] = useState("");
  const [selectedLeaderNotes, setSelectedLeaderNotes] = useState("");

  // Function to filter team leaders based on performance
  const filteredTeamLeaders = teamLeaders.filter((leader) => {
    if (!performanceFilter) return true;
    return leader.performance >= performanceFilter;
  });

  const handleSendEmail = (leader) => {
    // Logic to send email (replace with actual email functionality)
    alert(
      `Email sent to ${leader.name} (${leader.email}) with content: ${emailContent}`
    );
    setEmailContent("");
    setSelectedLeader(null);
  };

  const handleDownloadReport = (leader) => {
    // Logic to download a report (replace with actual functionality)
    alert(`Report downloaded for ${leader.name}`);
  };

  const handleAddNote = (leader) => {
    const updatedLeaders = teamLeaders.map((l) => {
      if (l.id === leader.id) {
        return { ...l, notes: [...l.notes, selectedLeaderNotes] };
      }
      return l;
    });
    setTeamLeaders(updatedLeaders);
    setSelectedLeaderNotes("");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Performance Management</h2>

      <div className="mb-4">
        <label className="mr-2">Filter by Performance (%):</label>
        <input
          type="number"
          value={performanceFilter}
          onChange={(e) => setPerformanceFilter(e.target.value)}
          className="border p-2"
          placeholder="Enter minimum percentage"
        />
      </div>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="border px-4 py-2">Team Leader</th>
            <th className="border px-4 py-2">Team</th>
            <th className="border px-4 py-2">Performance (%)</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeamLeaders.map((leader) => (
            <tr key={leader.id}>
              <td className="border px-4 py-2">{leader.name}</td>
              <td className="border px-4 py-2">{leader.team}</td>
              <td className="border px-4 py-2">{leader.performance}%</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => setSelectedLeader(leader)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Request Progress Report
                </button>
                <button
                  onClick={() => handleDownloadReport(leader)}
                  className="bg-green-500 text-white px-2 py-1 rounded ml-2"
                >
                  Download Report
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedLeader && (
        <div className="mt-4 p-4 border border-gray-300 rounded">
          <h3 className="text-xl font-semibold mb-2">
            Send Email to {selectedLeader.name}
          </h3>
          <textarea
            rows="4"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            className="border p-2 w-full"
            placeholder="Write your message here..."
          />
          <button
            onClick={() => handleSendEmail(selectedLeader)}
            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
          >
            Send Email
          </button>

          <div className="mt-4">
            <h4 className="font-semibold">Add Note:</h4>
            <textarea
              rows="2"
              value={selectedLeaderNotes}
              onChange={(e) => setSelectedLeaderNotes(e.target.value)}
              className="border p-2 w-full"
              placeholder="Add a note for this team leader..."
            />
            <button
              onClick={() => handleAddNote(selectedLeader)}
              className="bg-orange-500 text-white px-4 py-2 rounded mt-2"
            >
              Add Note
            </button>
          </div>

          {selectedLeader.notes.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">Notes:</h4>
              <ul>
                {selectedLeader.notes.map((note, index) => (
                  <li key={index} className="border p-2 my-1">
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PerformanceManage;
