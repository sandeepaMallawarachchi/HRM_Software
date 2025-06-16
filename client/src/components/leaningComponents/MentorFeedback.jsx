import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MentorFeedback = () => {
    const empId = localStorage.getItem('empId');
    const [feedback, setFeedback] = useState({});

    const fetchFeedback = async () => {
        try {
            const response = await axios.get(`https://global-hrm-mobile-server.vercel.app/learning/getEmpFeedback/${empId}`);
            setFeedback(response.data);
        } catch (error) {
            console.error('Error fetching feedback:', error);
        }
    };

    const getInitials = (name) => {
        const nameParts = name.split(' ');
        return nameParts.map(part => part[0].toUpperCase()).join('');
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    return (
        <div className="card bg-gradient-to-r from-blue-500 to-blue-300 text-black rounded-lg p-5  transition-shadow duration-300 hover:shadow-lg">
            <h2 className="text-lg  font-semibold mb-2">
                Peer and Mentor Interaction
            </h2>
            <div className="flex items-center mb-4">
                <div className="bg-white text-blue-500 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    <span className="font-bold">{feedback.mentor ? getInitials(feedback.mentor) : 'N/A'}</span>
                </div>
                <div>
                    <p className="text-sm">
                        Current Mentor: {feedback.mentor}
                    </p>
                </div>
            </div>
            <p className="text-sm italic">
                Recent Feedback: {feedback.feedback}
            </p>
        </div>
    );
};

export default MentorFeedback;