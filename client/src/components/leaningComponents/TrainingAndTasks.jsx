import React, { useEffect, useState } from "react";
import axios from "axios";

const TrainingAndTasks = () => {
    const empId = localStorage.getItem('empId');
    const [training, setTraining] = useState([]);

    useEffect(() => {

        const fetchTraining = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/admin/getAllocatedTraining/${empId}`);
                setTraining(response.data);
            } catch (error) {
                console.error("Error fetching training data:", error);
            }
        };

        fetchTraining();
    }, [empId]);

    return (
        <div className="card bg-gray-100 border border-gray-300 rounded-lg p-5 ">
            <div className='flex justify-between'>
                <h2 className="text-lg font-semibold mb-2">Training Overview</h2>
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300"
                >
                    View All
                </button>
            </div>
            <div className="mt-4">
                <h3 className="font-semibold mb-2">Ongoing Tasks</h3>
                <ul className="list-disc list-inside ml-5 bg-orange-100 p-2 rounded">
                    {training
                        .slice(0, 5)
                        .map((records) => (
                            <li key={records.id} className="text-orange-600">
                                {records.training}
                            </li>
                        ))}
                </ul>
                <h3 className="font-semibold mt-4 mb-2">Completed Tasks</h3>
                <ul className="list-disc list-inside ml-5">
                    <li className="text-yellow-600 bg-yellow-100 p-2 rounded">
                        Intro to JavaScript
                    </li>
                    <li className="text-yellow-600 bg-yellow-100 p-2 rounded">
                        Git & GitHub Basics
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default TrainingAndTasks