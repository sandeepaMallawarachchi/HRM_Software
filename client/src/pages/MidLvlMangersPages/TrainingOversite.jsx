import React, { useState } from "react";

// Sample data for training sessions
const initialTrainings = [
  {
    id: 1,
    trainingName: "Project Management Basics",
    trainer: "John Doe",
    date: "2024-10-30",
    duration: "3 hours",
    status: "Ongoing",
  },
  {
    id: 2,
    trainingName: "Effective Communication Skills",
    trainer: "Jane Smith",
    date: "2024-11-05",
    duration: "2 hours",
    status: "Upcoming",
  },
];

const TrainingOversite = () => {
  const [trainings, setTrainings] = useState(initialTrainings);
  const [trainingName, setTrainingName] = useState("");
  const [trainer, setTrainer] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState("Upcoming");

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
