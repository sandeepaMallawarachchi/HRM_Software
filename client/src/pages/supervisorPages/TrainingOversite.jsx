import React, { useState, useEffect } from "react";
import axios from "axios";
import AddNewTraining from '../MidLvlMangersPages/AddNewTraining'
import NewTrainingAllocation from "../MidLvlMangersPages/NewTrainingAllocation";

const TrainingOversite = () => {
  const [trainings, setTrainings] = useState([]);
  const [allocationHistory, setAllocationHistory] = useState([]);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [selectedTrainingWeight, setSelectedTrainingWeight] = useState(null);
  // const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const response = await axios.get(`https://global-hrm-mobile-server.vercel.app/admin/getAllTrainings`);
        setTrainings(response.data);
      } catch (error) {
        console.log(error)
      }
    };
    fetchTraining();
  }, []);

  useEffect(() => {
    const fetchAllocatedTrainings = async () => {
      try {
        const response = await axios.get(`https://global-hrm-mobile-server.vercel.app/admin/getAllAllocatedTraining`);
        setAllocationHistory(response.data);
      } catch (error) {
        console.log(error)
      }
    };
    fetchAllocatedTrainings();
  }, []);

  const handleNewAllocation = (training, weight) => {
    setSelectedTraining(training);
    setSelectedTrainingWeight(weight);
    setIsEmployeeModalOpen(true);
  };

  const handleNewTraining = () => {
    setIsTrainingModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEmployeeModalOpen(false);
    setIsTrainingModalOpen(false);
    setSelectedTraining(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA');
  };

  const handleTrainingComplete = async (id, training, empId) => {
    try {
      await axios.put(`https://global-hrm-mobile-server.vercel.app/admin/updateStatus/${id}/${training}/${empId}`);

      await axios.put(`https://global-hrm-mobile-server.vercel.app/admin/saveReminder/${id}/${training}/${empId}`, {
        reminderResponse: 0,
      });

      alert("Training marked as completed successfully");

      // Optionally fetch updated data
      const response = await axios.get(`https://global-hrm-mobile-server.vercel.app/admin/getAllAllocatedTraining`);
      setAllocationHistory(response.data);
    } catch (error) {
      alert("Error updating training status!");
    }
  }

  const handleReminder = async (id, training, empId) => {
    try {
      await axios.put(`https://global-hrm-mobile-server.vercel.app/admin/saveReminder/${id}/${training}/${empId}`, {
        reminderResponse: 1,
      });

      alert("Reminder send successfully");
    } catch (error) {
      alert("Error sending reminder!");
    }
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Training Allocation</h2>

      <div className="mb-4 flex justify-between">
        <button
          onClick={handleNewTraining}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition duration-300"
        >
          Add New Training
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-2">Available Trainings</h3>
      <table className="min-w-full bg-white border border-gray-200 mb-4">
        <thead>
          <tr>
            <th className="border-b px-4 py-2">Training Name</th>
            <th className="border-b px-4 py-2">Weight</th>
            <th className="border-b px-4 py-2">Duration (Hours)</th>
            <th className="border-b px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {trainings.map((training) => (
            <tr key={training.id}>
              <td className="border-b px-4 py-2">{training.training}</td>
              <td className="border-b px-4 py-2">{training.weight}</td>
              <td className="border-b px-4 py-2">{training.duration}</td>
              <td className="border-b px-4 py-2 text-center">
                {/* <button
                  onClick={() => handleNewAllocation(training.training, training.weight)}
                  className={`px-2 py-1 rounded ${training.status === 'Ongoing'
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-blue-300 text-white cursor-not-allowed"
                    }`}
                  disabled={training.status != 'Ongoing'}
                >
                  Allocate
                </button> */}

                <button
                  onClick={() => handleNewAllocation(training.training, training.weight)}
                  className="px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Allocate
                </button>
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
            <th className="border-b px-4 py-2">Training Name</th>
            <th className="border-b px-4 py-2">Allocated Date</th>
            <th className="border-b px-4 py-2">Finished Date</th>
            <th className="border-b px-4 py-2">Status</th>
            <th className="border-b px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {allocationHistory.map((history, index) => (
            <tr key={index} className="text-center">
              <td className="border-b px-4 py-2">{history.NAME}</td>
              <td className="border-b px-4 py-2">{history.training}</td>
              <td className="border-b px-4 py-2">{formatDate(history.allocatedate)}</td>
              {history.status === 'Ongoing' ?
                <td className="border-b px-4 py-2">Not Finished Yet</td>
                :
                <td className="border-b px-4 py-2">{formatDate(history.finisheddate)}</td>
              }
              <td className={`border-b px-4 py-2 font-medium ${history.status === 'Ongoing' ?
                'text-orange-500'
                : 'text-green-500'
                }`}>
                {history.status}
              </td>
              <td className="border-b px-4 py-2">
                <div className="flex justify-between">
                  <button
                    onClick={() => handleTrainingComplete(history.id, history.training, history.empId)}
                    className={`px-2 py-1 rounded text-white ${history.status === "Ongoing"
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-blue-300 cursor-not-allowed"
                      }`}
                    disabled={history.status === "Completed"}
                  >
                    Mark as Completed
                  </button>

                  <button
                    onClick={() => handleReminder(history.id, history.training, history.empId)}
                    className={`px-2 py-1 rounded text-white ${history.status === "Ongoing"
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-orange-300 cursor-not-allowed"
                      }`} disabled={history.status === "Completed"}
                  >
                    Send an Reminder
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEmployeeModalOpen && <NewTrainingAllocation selectedTraining={selectedTraining} selectedTrainingWeight={selectedTrainingWeight} onClose={handleModalClose} />}
      {isTrainingModalOpen && <AddNewTraining onClose={handleModalClose} />}
    </div>
  );
};

export default TrainingOversite;
