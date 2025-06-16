import axios from "axios";
import React, { useState } from "react";

const AddNewTraining = ({ onClose }) => {
    const [trainingData, setTrainingData] = useState({
        training: '',
        weight: '',
        duration: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setTrainingData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newTraining = {
            training: trainingData.training,
            weight: trainingData.weight,
            duration: trainingData.duration,
        };

        try {
            await axios.post(`https://global-hrm-mobile-server.vercel.app/admin/addNewTraining`, newTraining);
            setTrainingData({
                training: '',
                weight: '',
                duration: '',
            });
            alert('New training added successfully!');
        } catch (error) {
            console.error('Error adding training:', error);
            alert('Failed to add training.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-8 w-2/3 shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Add New Training</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="training" className="block text-sm font-semibold text-gray-700 mb-2">
                            Training
                        </label>
                        <input
                            id="training"
                            type="text"
                            placeholder="Enter training name"
                            value={trainingData.training}
                            onChange={handleChange}
                            name="training"
                            className="border border-gray-300 rounded-lg p-3 mb-3 w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="weight" className="block text-sm font-semibold text-gray-700 mb-2">
                            Weight
                        </label>
                        <input
                            id="weight"
                            type="number"
                            placeholder="Enter weight of training"
                            value={trainingData.weight}
                            onChange={handleChange}
                            name="weight"
                            className="border border-gray-300 rounded-lg p-3 mb-3 w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 mb-2">
                            Duration (Hours)
                        </label>
                        <input
                            id="duration"
                            type="number"
                            placeholder="Enter duration of training"
                            value={trainingData.duration}
                            onChange={handleChange}
                            name="duration"
                            className="border border-gray-300 rounded-lg p-3 mb-3 w-full"
                        />
                    </div>
                    <div className="flex justify-start mt-4 space-x-4">
                        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg">
                            Save
                        </button>
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 hover:underline">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNewTraining;