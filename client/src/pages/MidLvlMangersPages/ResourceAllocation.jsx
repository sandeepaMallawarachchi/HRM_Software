import React, { useState, useEffect } from "react";
import axios from "axios";
import NewResourceAllocation from "./NewResourceAllocation";
import AddNewResource from "./AddNewResource";

const ResourceAllocation = () => {
  const [resources, setResources] = useState([]);
  const [allocationHistory, setAllocationHistory] = useState([]);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isResourseModalOpen, setIsResourseModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [editedQuantities, setEditedQuantities] = useState({});

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/admin/getAllResources`);
        setResources(response.data);
      } catch (error) {
        console.log(error)
      }
    };
    fetchResources();
  }, []);

  useEffect(() => {
    const fetchAllocatedResources = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/admin/getAllAllocatedResources`);
        setAllocationHistory(response.data);
      } catch (error) {
        console.log(error)
      }
    };
    fetchAllocatedResources();
  }, []);

  const handleNewAllocation = (resource, id) => {
    setSelectedResource(resource);
    setSelectedResourceId(id);
    setIsEmployeeModalOpen(true);
  };

  const handleNewResourse = () => {
    setIsResourseModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEmployeeModalOpen(false);
    setIsResourseModalOpen(false);
    setSelectedResource(null);
  };

  const handleQuantityChange = (id, newQuantity) => {
    setEditedQuantities((prev) => ({
      ...prev,
      [id]: newQuantity,
    }));
  };

  const handleUpdateQuantity = async (id) => {
    const newQuantity = editedQuantities[id];
    try {
      await axios.put(`http://localhost:4000/admin/updateResource/${id}/${newQuantity}`);
      setResources((prevResources) =>
        prevResources.map((resource) =>
          resource.id === id ? { ...resource, quantity: parseInt(newQuantity, 10) } : resource
        )
      );
      setEditedQuantities((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      alert("Resource quantity updated successfully");
    } catch (error) {
      alert("Error updating resource quantity!");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA');
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Resource Allocation</h2>

      <div className="mb-4 flex justify-between">
        <button
          onClick={handleNewResourse}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition duration-300"
        >
          Add New Resource
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-2">Available Resources</h3>
      <table className="min-w-full bg-white border border-gray-200 mb-4">
        <thead>
          <tr>
            <th className="border-b px-4 py-2">Resource Name</th>
            <th className="border-b px-4 py-2">Type</th>
            <th className="border-b px-4 py-2">Quantity</th>
            <th className="border-b px-4 py-2">Status</th>
            <th className="border-b px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {resources.map((resource) => (
            <tr key={resource.id}>
              <td className="border-b px-4 py-2">{resource.resource}</td>
              <td className="border-b px-4 py-2">{resource.TYPE}</td>
              <td className="border-b px-4 py-2">
                <input
                  type="number"
                  value={editedQuantities[resource.id] ?? resource.quantity}
                  min={0}
                  onChange={(e) => handleQuantityChange(resource.id, e.target.value)}
                  className="border-b rounded px-2 py-1 w-20"
                />
              </td>
              {resource.quantity > 0 ? (
                <td className="border-b px-4 py-2 text-green-500 font-medium">Available</td>
              ) : (
                <td className="border-b px-4 py-2 text-red-500 font-medium">Not Available</td>
              )}
              <td className="border-b px-4 py-2 text-center">
                <button
                  onClick={() => handleNewAllocation(resource.resource, resource.id)}
                  className={`px-2 py-1 rounded ${resource.quantity > 0
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-blue-300 text-white cursor-not-allowed"
                    }`}
                  disabled={resource.quantity <= 0}
                >
                  Allocate
                </button>
                {editedQuantities[resource.id] !== undefined &&
                  editedQuantities[resource.id] !== resource.quantity && (
                    <button
                      onClick={() => handleUpdateQuantity(resource.id)}
                      className="ml-2 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Update
                    </button>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-xl font-semibold mt-8 mb-2">Allocation History</h3>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="border-b px-4 py-2">Allocated Employee</th>
            <th className="border-b px-4 py-2">Resource Name</th>
            <th className="border-b px-4 py-2">Quantity</th>
            <th className="border-b px-4 py-2">Allocated Date</th>
            <th className="border-b px-4 py-2">Due Return Date</th>
            <th className="border-b px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {allocationHistory.map((history, index) => (
            <tr key={index} className="text-center">
              <td className="border-b px-4 py-2">{history.NAME}</td>
              <td className="border-b px-4 py-2">{history.resource}</td>
              <td className="border-b px-4 py-2">{history.quantity}</td>
              <td className="border-b px-4 py-2">{formatDate(history.allocatedate)}</td>
              <td className="border-b px-4 py-2">{formatDate(history.returneddate)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEmployeeModalOpen && <NewResourceAllocation selectedResource={selectedResource} selectedResourceId={selectedResourceId} onClose={handleModalClose} />}
      {isResourseModalOpen && <AddNewResource onClose={handleModalClose} />}
    </div>
  );
};

export default ResourceAllocation;