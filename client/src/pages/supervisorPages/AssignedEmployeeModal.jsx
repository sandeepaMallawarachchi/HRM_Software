import React, { useEffect, useState } from "react";
import axios from "axios";

const AssignedEmployeeModal = ({ onClose, selectedEmpId }) => {
    const empId = localStorage.getItem("empId");
    const [certificatesList, setCertificatesList] = useState([]);
    const [training, setTraining] = useState([]);
    const [skills, setSkills] = useState([]);
    const [newFeedback, setNewFeedback] = useState('');
    const [newRecommandation, setNewRecommandation] = useState('');
    const [newSteps, setNewSteps] = useState('');

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/employees/getCertificates/${empId}`);
                setCertificatesList(response.data);
            } catch (error) {
                console.error("Error fetching certificates:", error);
            }
        };

        const fetchTraining = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/admin/getAllocatedTraining/${empId}`);
                setTraining(response.data);
            } catch (error) {
                console.error("Error fetching training data:", error);
            }
        };

        const fetchSkills = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/learning/getSkill/${empId}`);
                setSkills(response.data);
            } catch (error) {
                console.error('Error fetching skills:', error);
            }
        };

        fetchSkills();
        fetchTraining();
        fetchCertificates();
    }, [empId]);

    const addFeedback = async () => {
        try {
            const stepsArray = newSteps.split(',').map((step) => step.trim());
            if (!newFeedback || !newRecommandation || stepsArray.length === 0) return alert('Feedback and steps are required.');
            await axios.post(`http://localhost:4000/learning/addFeedback/${empId}/${selectedEmpId}`, {
                feedback: newFeedback,
                recommendation: newRecommandation,
                steps: stepsArray,
            });
            setNewFeedback('');
            setNewRecommandation('');
            setNewSteps('');
        } catch (error) {
            console.error('Error adding feedback:', error);
            alert('Error adding feedback');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-2/3 overflow-y-auto max-h-[90vh]">
                <h2 className="text-lg font-semibold mb-4">All Certifications</h2>
                <div className="overflow-y-auto max-h-64">
                    <table className="min-w-full border border-gray-300 bg-white rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-4 py-2 text-left font-semibold">Name</th>
                                <th className="border px-4 py-2 text-left font-semibold">Link</th>
                                <th className="border px-4 py-2 text-left font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {certificatesList.map((certificate) => (
                                <tr key={certificate.id}>
                                    <td className="border px-4 py-2">{certificate.certificate_name}</td>
                                    <td className="border px-4 py-2">
                                        <a
                                            href={certificate.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline text-blue-500"
                                        >
                                            View
                                        </a>
                                    </td>
                                    <td className="border px-4 py-2">{certificate.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <h2 className="text-lg font-semibold my-4">All Trainings</h2>
                <div className="overflow-y-auto max-h-64">
                    <table className="min-w-full border border-gray-300 bg-white rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-4 py-2 text-left font-semibold">Training</th>
                                <th className="border px-4 py-2 text-left font-semibold">Weight</th>
                                <th className="border px-4 py-2 text-left font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {training.map((training) => (
                                <tr key={training.id}>
                                    <td className="border px-4 py-2">{training.training}</td>
                                    <td className="border px-4 py-2">{training.weight}</td>
                                    <td className="border px-4 py-2">{training.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <h2 className="text-lg font-semibold my-4">All Skills</h2>
                <div className="overflow-y-auto max-h-64">
                    <table className="min-w-full border border-gray-300 bg-white rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-4 py-2 text-left font-semibold">Skill</th>
                                <th className="border px-4 py-2 text-left font-semibold">Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            {skills.map((skill) => (
                                <tr key={skill.id}>
                                    <td className="border px-4 py-2">{skill.skill}</td>
                                    <td className="border px-4 py-2">{skill.level}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <h2 className="text-lg font-semibold my-4">Add Feedback and Recommendations</h2>
                <div className="mt-2">
                    <label htmlFor="feedback">Enter feedback</label>
                    <input
                        type="text"
                        value={newFeedback}
                        placeholder="Enter Feedback"
                        onChange={(e) => setNewFeedback(e.target.value)}
                        className="rounded-lg px-3 my-2 py-2 text-gray-900 focus:outline-none w-full mb-2"
                    />
                    <label htmlFor="feedback">Enter recommendation</label>
                    <input
                        type="text"
                        value={newRecommandation}
                        placeholder="Enter Reccomandation"
                        onChange={(e) => setNewRecommandation(e.target.value)}
                        className="rounded-lg px-3 my-2 py-2 text-gray-900 focus:outline-none w-full mb-2"
                    />
                    <label htmlFor="feedback">Enter recommended steps</label>
                    <textarea
                        value={newSteps}
                        placeholder="Enter steps (comma-separated)"
                        onChange={(e) => setNewSteps(e.target.value)}
                        className="rounded-lg px-3 my-2 py-2 text-gray-900 focus:outline-none w-full mb-2"
                    ></textarea>
                    <button
                        onClick={addFeedback}
                        className="bg-orange-500 text-white rounded-lg px-4 py-2 mt-2 hover:bg-orange-600 w-1/4"
                    >
                        Add Feedback
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="mt-4 text-gray-600 hover:underline px-4 py-2 rounded-lg"
                >
                    Close
                </button>
            </div>
        </div>
    )
}

export default AssignedEmployeeModal