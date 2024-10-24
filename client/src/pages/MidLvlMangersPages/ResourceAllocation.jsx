import React, { useState } from "react";

const ResourceAllocation = () => {
  const [resources] = useState([
    { id: 1, name: "John Doe", type: "Employee", project: "", available: true },
    {
      id: 2,
      name: "Jane Smith",
      type: "Employee",
      project: "",
      available: true,
    },
    {
      id: 3,
      name: "Projector",
      type: "Equipment",
      project: "",
      available: true,
    },
    {
      id: 4,
      name: "Office Supplies",
      type: "Material",
      project: "",
      available: true,
    },
  ]);

  const [selectedResource, setSelectedResource] = useState(null);
  const [allocatedResources, setAllocatedResources] = useState([]);
  const [allocationHistory, setAllocationHistory] = useState([]);
  const [projectName, setProjectName] = useState("");

  const handleAllocateResource = (resource) => {
    if (!projectName) {
      alert("Please enter a project name.");
      return;
    }

    const updatedResource = {
      ...resource,
      project: projectName,
      available: false,
    };
    const newAllocatedResources = [...allocatedResources, updatedResource];
    const newAllocationHistory = [
      ...allocationHistory,
      { ...updatedResource, date: new Date().toLocaleString() },
    ];

    setAllocatedResources(newAllocatedResources);
    setAllocationHistory(newAllocationHistory);
    setSelectedResource(null);
    setProjectName("");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Resource Allocation</h2>

      <div className="mb-4">
        <label className="block mb-2">Project Name:</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="border p-2 w-full"
          placeholder="Enter the project name"
        />
      </div>

      <h3 className="text-xl font-semibold mb-2">Available Resources</h3>
      <table className="min-w-full bg-white border border-gray-200 mb-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">Resource Name</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {resources
            .filter((resource) => resource.available)
            .map((resource) => (
              <tr key={resource.id}>
                <td className="border px-4 py-2">{resource.name}</td>
                <td className="border px-4 py-2">{resource.type}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => setSelectedResource(resource)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Allocate
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {selectedResource && (
        <div className="mt-4 p-4 border border-gray-300 rounded">
          <h3 className="text-lg font-semibold mb-2">
            Allocating: {selectedResource.name}
          </h3>
          <button
            onClick={() => handleAllocateResource(selectedResource)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Confirm Allocation to Project
          </button>
        </div>
      )}

      <h3 className="text-xl font-semibold mt-8 mb-2">Allocation History</h3>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="border px-4 py-2">Resource Name</th>
            <th className="border px-4 py-2">Project</th>
            <th className="border px-4 py-2">Date Allocated</th>
          </tr>
        </thead>
        <tbody>
          {allocationHistory.map((history, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{history.name}</td>
              <td className="border px-4 py-2">{history.project}</td>
              <td className="border px-4 py-2">{history.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResourceAllocation;
