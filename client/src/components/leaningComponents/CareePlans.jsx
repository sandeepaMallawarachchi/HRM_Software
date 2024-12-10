import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CareerPlans = () => {
    const empId = localStorage.getItem('empId');
    const [careerPlans, setCareerPlans] = useState([]);
    const [newPlan, setNewPlan] = useState('');
    const [newSteps, setNewSteps] = useState('');

    const fetchCareerPlans = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/learning/getCareerPlan/${empId}`);
            setCareerPlans(response.data);
        } catch (error) {
            console.error('Error fetching career plans:', error);
        }
    };

    const addCareerPlan = async () => {
        try {
            const stepsArray = newSteps.split(',').map((step) => step.trim());
            if (!newPlan || stepsArray.length === 0) return alert('Plan and steps are required.');
            await axios.post(`http://localhost:4000/learning/addCareerPlan/${empId}`, {
                plan: newPlan,
                steps: stepsArray,
            });
            setNewPlan('');
            setNewSteps('');
            fetchCareerPlans();
        } catch (error) {
            console.error('Error adding career plan:', error);
            alert('Error adding career plan');
        }
    };

    useEffect(() => {
        fetchCareerPlans();
    }, []);

    return (
        <div className="card bg-gradient-to-r from-indigo-500 to-indigo-300 text-gray-900 rounded-lg p-5 transition-shadow duration-300 hover:shadow-lg flex flex-col justify-between h-full">
            <h2 className="text-lg font-semibold mb-2">Career Plans</h2>
            <div className="overflow-y-auto max-h-52 space-y-3">
                <ul className="space-y-3 mb-4">
                    {careerPlans.map((plan) => (
                        <li key={plan.id} className="flex flex-col space-y-1">
                            <span className="font-medium">Current Designation: {plan.designation}</span>
                            <span className="font-medium">Plan: {plan.plan}</span>
                            <div>
                                Steps:
                                <ul className="list-disc pl-5 text-sm">
                                    {plan.steps.map((step, index) => (
                                        <li key={index}>{step}</li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-4">
                <input
                    type="text"
                    value={newPlan}
                    placeholder="Enter plan"
                    onChange={(e) => setNewPlan(e.target.value)}
                    className="rounded-lg px-3 py-2 text-gray-900 focus:outline-none w-full mb-2"
                />
                <textarea
                    value={newSteps}
                    placeholder="Enter steps (comma-separated)"
                    onChange={(e) => setNewSteps(e.target.value)}
                    className="rounded-lg px-3 py-2 text-gray-900 focus:outline-none w-full mb-2"
                ></textarea>
                <button
                    onClick={addCareerPlan}
                    className="bg-indigo-600 text-white rounded-lg px-4 py-2 mt-2 hover:bg-indigo-700 w-full"
                >
                    Add Career Plan
                </button>
            </div>
        </div>
    );
};

export default CareerPlans;