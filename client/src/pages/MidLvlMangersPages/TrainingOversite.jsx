import React, { useState, useEffect } from "react";
import axios from "axios";
import NewResourceAllocation from "./NewResourceAllocation";
import AddNewTraining from './AddNewTraining'

const TrainingOversite = () => {
  const [trainings, setTrainings] = useState([]);
  const [allocationHistory, setAllocationHistory] = useState([]);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isResourseModalOpen, setIsResourseModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [selectedResourceQuantity, setSelectedResourceQuantity] = useState(null);
  const [editedQuantities, setEditedQuantities] = useState({});
  const today = new Date().toISOString().split('T')[0];

  const handleAddTraining = () => {
    const newTraining = {
      id: trainings.length + 1,
      trainingName,
      trainer,
      date,
      duration,
      status,
    };
    setTrainings([...trainings, newTraining]);
    // Reset form fields
    setTrainingName("");
    setTrainer("");
    setDate("");
    setDuration("");
    setStatus("Upcoming");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Training Oversight</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold">Add New Training</h3>
        <input
          type="text"
          placeholder="Training Name"
          value={trainingName}
          onChange={(e) => setTrainingName(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Trainer Name"
          value={trainer}
          onChange={(e) => setTrainer(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 w-full mb-2"
        >
          <option value="Upcoming">Upcoming</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
        <button
          onClick={handleAddTraining}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Training
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-2">Current Training Sessions</h3>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Training Name</th>
            <th className="border border-gray-300 px-4 py-2">Trainer</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Duration</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {trainings.map((training) => (
            <tr key={training.id}>
              <td className="border border-gray-300 px-4 py-2">
                {training.trainingName}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {training.trainer}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {training.date}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {training.duration}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {training.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrainingOversite;
