import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';


const Resume = () => {
  const [experienceList, setExperienceList] = useState([
    { id: 1, date: '04/26/1999 - Current', company: 'Evans, Cooper and White', role: 'Therapist, speech and language' },
    { id: 2, date: '11/26/1998 - Current', company: 'Rivera, Shaw and Hughes', role: 'Landscape architect' },
    { id: 3, date: '02/24/2002 - 07/27/2007', company: 'Hughes, Parker and Barber', role: 'Engineer, drilling' },
  ]);

  const [educationList, setEducationList] = useState([
    { id: 1, date: '06/26/1997 - 03/17/1999', institution: 'Parke State School' },
  ]);

  const [newExperience, setNewExperience] = useState({ date: '', company: '', role: '' });
  const [newEducation, setNewEducation] = useState({ date: '', institution: '' });

  // Add new experience
  const handleAddExperience = () => {
    setExperienceList([...experienceList, { id: Date.now(), ...newExperience }]);
    setNewExperience({ date: '', company: '', role: '' });
  };

  // Delete experience
  const handleDeleteExperience = (id) => {
    setExperienceList(experienceList.filter(exp => exp.id !== id));
  };

  // Add new education
  const handleAddEducation = () => {
    setEducationList([...educationList, { id: Date.now(), ...newEducation }]);
    setNewEducation({ date: '', institution: '' });
  };

  // Delete education
  const handleDeleteEducation = (id) => {
    setEducationList(educationList.filter(edu => edu.id !== id));
  };

  return (
    <div className="mt-4 bg-[#f6f5fb] p-6 rounded-lg">
      {/* Experience Section */}
      <div className="mb-8">
        <h3 className="text-lg mb-4">Experience</h3>
        {experienceList.map(exp => (
          <div key={exp.id} className="bg-white p-4 mb-4 rounded-lg shadow-sm relative">
            <p>{exp.date}</p>
            <p className="font-semibold">{exp.company}</p>
            <p>{exp.role}</p>
            <button
              onClick={() => handleDeleteExperience(exp.id)}
              className="absolute top-4 right-4 text-orange-500 hover:text-orange-600">
              <FaTrash />
            </button>
          </div>
        ))}
        <div className="mt-4">
          <label htmlFor="from" className='mr-2'>From</label>
          <input
            type="date"
            value={newExperience.date}
            onChange={(e) => setNewExperience({ ...newExperience, date: e.target.value })}
            className="border rounded-md p-2 mr-2"
          />
          <label htmlFor="from" className='mr-2'>To</label>
          <input
            type="date"
            value={newExperience.date}
            onChange={(e) => setNewExperience({ ...newExperience, date: e.target.value })}
            className="border rounded-md p-2 mr-2"
          />
          <input
            type="text"
            value={newExperience.company}
            onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
            placeholder="Company"
            className="border rounded-md p-2 mr-2"
          />
          <input
            type="text"
            value={newExperience.role}
            onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
            placeholder="Role"
            className="border rounded-md p-2"
          />
          <button onClick={handleAddExperience} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 mt-2 ml-2 rounded-[20px]">Add</button>
        </div>
      </div>

      {/* Education Section */}
      <div>
        <h3 className="text-lg mb-4">Education</h3>
        {educationList.map(edu => (
          <div key={edu.id} className="bg-white p-4 mb-4 rounded-lg shadow-sm relative">
            <p>{edu.date}</p>
            <p className="font-semibold">{edu.institution}</p>
            <button
              onClick={() => handleDeleteEducation(edu.id)}
              className="absolute top-4 right-4 text-orange-500 hover:text-orange-600">
              <FaTrash />
            </button>
          </div>
        ))}
        <div className="mt-4">
          <label htmlFor="from" className='mr-2'>From</label>
          <input
            type="date"
            value={newEducation.date}
            onChange={(e) => setNewEducation({ ...newEducation, date: e.target.value })}
            className="border rounded-md p-2 mr-2"
          />
          <label htmlFor="from" className='mr-2'>To</label>
          <input
            type="date"
            value={newEducation.date}
            onChange={(e) => setNewEducation({ ...newEducation, date: e.target.value })}
            className="border rounded-md p-2 mr-2"
          />
          <input
            type="text"
            value={newEducation.institution}
            onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
            placeholder="Institution"
            className="border rounded-md p-2"
          />
          <button onClick={handleAddEducation} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 mt-2 ml-2 rounded-[20px]">Add</button>
        </div>
      </div>
    </div>
  );
};

export default Resume;