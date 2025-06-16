import axios from "axios";
import React, { useState } from "react";

const NewStrategicGoal = () => {
    const empId = localStorage.getItem('empId');
    const [planData, setPlanData] = useState({
        goal: '',
        description: '',
        deadline: '',
        progress: '',
    });
    const [progressError, setProgressError] = useState('');

    const today = new Date().toISOString().split('T')[0];

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'progress') {
            if (value < 0 || value > 100) {
                setProgressError('Progress must be between 0 and 100');
            } else {
                setProgressError('');
            }
        }

        setPlanData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (progressError) {
            alert('Please fix the errors before submitting');
            return;
        }

        const newPlan = {
            empId,
            goal: planData.goal,
            description: planData.description,
            deadline: planData.deadline,
            progress: planData.progress,
        };

        try {
            await axios.post(`https://global-hrm-mobile-server.vercel.app/admin/addStrategicPlan/${empId}`, newPlan);
            setPlanData({
                goal: '',
                description: '',
                deadline: '',
                progress: '',
            });
            alert('Strategic Plan submitted successfully!');
        } catch (error) {
            console.error('Error submitting strategic plan:', error);
            alert('Failed to submit strategic plan.');
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
            <div >
                <h3 className="text-xl font-semibold mb-4">Add New Strategic Goal</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="goal" className="block text-sm font-semibold text-gray-700 mb-2">
                            Goal
                        </label>
                        <input
                            id="goal"
                            type="text"
                            placeholder="Enter Goal of Strategic Plan"
                            value={planData.goal}
                            onChange={handleChange}
                            name="goal"
                            className="border border-gray-300 rounded-lg p-3 mb-3 w-full"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            placeholder="Enter Description of Strategic Plan"
                            value={planData.description}
                            onChange={handleChange}
                            name="description"
                            className="border border-gray-300 rounded-lg p-3 mb-3 w-full"
                        />
                    </div>

                    <div>
                        <label htmlFor="deadline" className="block text-sm font-semibold text-gray-700 mb-2">
                            Deadline
                        </label>
                        <input
                            id="deadline"
                            type="date"
                            value={planData.deadline}
                            onChange={handleChange}
                            min={today}
                            name="deadline"
                            className="border border-gray-300 rounded-lg p-3 mb-3 w-full"
                        />
                    </div>

                    <div>
                        <label htmlFor="progress" className="block text-sm font-semibold text-gray-700 mb-2">
                            Progress (%)
                        </label>
                        <input
                            id="progress"
                            type="number"
                            value={planData.progress}
                            onChange={handleChange}
                            name="progress"
                            className="border border-gray-300 rounded-lg p-3 mb-3 w-full"
                            min="0"
                            max="100"
                        />
                        {progressError && <p className="text-red-500 text-sm">{progressError}</p>}
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-300"
                        >
                            Add Goal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewStrategicGoal;
