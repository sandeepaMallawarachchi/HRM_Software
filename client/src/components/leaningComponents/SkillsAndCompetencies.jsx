import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SkillsAndCompetencies = () => {
    const empId = localStorage.getItem('empId');
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [newLevel, setNewLevel] = useState('Beginner');

    const fetchSkills = async () => {
        try {
            const response = await axios.get(`https://global-hrm-mobile-server.vercel.app/learning/getSkill/${empId}`);
            setSkills(response.data);
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };

    const addSkill = async () => {
        try {
            await axios.post(`https://global-hrm-mobile-server.vercel.app/learning/addSkill/${empId}`, {
                skill: newSkill,
                level: newLevel,
            });
            setNewSkill('');
            setNewLevel('Beginner');
            fetchSkills();
            alert("Skill added successfully")
        } catch (error) {
            console.error('Error adding skill:', error);
            alert("Error adding skill")
        }
    };

    const updateSkillLevel = async (id, level) => {
        try {
            await axios.put(`https://global-hrm-mobile-server.vercel.app/learning/updateSkill/${id}/${level}`);
            fetchSkills();
        } catch (error) {
            console.error('Error updating skill level:', error);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    return (
        <div className="card bg-gradient-to-r from-indigo-500 to-indigo-300 text-white rounded-lg p-5 transition-shadow duration-300 hover:shadow-lg flex flex-col justify-between h-full">
            <h2 className="text-lg font-semibold mb-2">Skills and Competencies</h2>
            <div className="overflow-y-auto max-h-52 space-y-3">
                <ul className="space-y-3">
                    {skills.map((skill) => (
                        <li key={skill.id} className="flex justify-between items-center">
                            <span className="font-medium">{skill.skill}</span>
                            <select
                                className="bg-white text-indigo-600 font-medium rounded-full px-3 py-1 border-none"
                                value={skill.level}
                                onChange={(e) => updateSkillLevel(skill.id, e.target.value)}
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Pro">Pro</option>
                            </select>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-4">
                <input
                    type="text"
                    value={newSkill}
                    placeholder="Enter skill"
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="rounded-lg px-3 py-2 text-gray-900 focus:outline-none w-full mb-2"
                />
                <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                    className="rounded-lg px-3 py-2 text-gray-900 focus:outline-none w-full mb-2"
                >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Pro">Pro</option>
                </select>
                <button
                    onClick={addSkill}
                    className="bg-indigo-600 text-white rounded-lg px-4 py-2 mt-2 hover:bg-indigo-700 w-full"
                >
                    Add Skill
                </button>
            </div>
        </div>
    );
};

export default SkillsAndCompetencies;