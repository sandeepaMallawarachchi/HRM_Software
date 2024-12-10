import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MentorFeedback = () => {
    const empId = localStorage.getItem('empId');
    const [feedback, setFeedback] = useState({});

    const fetchFeedback = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/learning/getEmpFeedback/${empId}`);
            setFeedback(response.data);
        } catch (error) {
            console.error('Error fetching feedback:', error);
        }
    };
    
    useEffect(() => {
        fetchFeedback();
    }, []);

    return (
        <div className="card bg-gradient-to-r from-green-400 to-green-300 text-black rounded-lg p-5 transition-shadow duration-300 hover:shadow-lg">
            <h2 className="text-lg font-semibold mb-2">
                Personalized Recommendations
            </h2>
            <p className="text-sm mb-2">Recommended Skill Focus:</p>
            <p className="text-sm italic">
                {feedback.recommendation}
            </p>

            <p className="text-sm mb-2 mt-4">Suggested Training:</p>
            <ul className="list-disc list-inside ml-5">
                {feedback.steps && JSON.parse(feedback.steps).map((step, index) => (
                    <li className="text-sm" key={index}>{step}</li>
                ))}
            </ul>
        </div>
    );
};

export default MentorFeedback;