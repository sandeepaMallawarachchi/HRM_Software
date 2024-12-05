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
            <h2 className="text-lg font-semibold">
                Training and Courses Overview
            </h2>
            <div className="mt-4">
                <h3 className="font-semibold">Ongoing Tasks</h3>
                <ul className="list-disc list-inside ml-5">
                    {training.map((records) => (
                        <li key={records.id} className="text-orange-600 bg-orange-100 p-2 rounded">
                            {records.training}
                        </li>
                    ))}
                </ul>
                <h3 className="font-semibold mt-4">Completed Tasks</h3>
                <ul className="list-disc list-inside ml-5">
                    <li className="text-yellow-600 bg-yellow-100 p-2 rounded">
                        Intro to JavaScript
                    </li>
                    <li className="text-yellow-600 bg-yellow-100 p-2 rounded">
                        Git & GitHub Basics
                    </li>
                </ul>
                <h3 className="font-semibold mt-4">Upcoming Tasks</h3>
                <ul className="list-disc list-inside ml-5">
                    <li className="text-blue-600 bg-blue-100 p-2 rounded">
                        Advanced React.js Workshop on November 5, 2024
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default TrainingAndTasks