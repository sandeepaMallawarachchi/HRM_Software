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

  const [newExperience, setNewExperience] = useState({ dateFrom: '', dateTo: '', company: '', role: '' });
  const [newEducation, setNewEducation] = useState({ dateFrom: '', dateTo: '', institution: '' });

  const [editExperience, setEditExperience] = useState(null);
  const [editEducation, setEditEducation] = useState(null);

  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [isAddingEducation, setIsAddingEducation] = useState(false);

  // Add new experience
  const handleAddExperience = () => {
    setExperienceList([...experienceList, { id: Date.now(), ...newExperience }]);
    setNewExperience({ dateFrom: '', dateTo: '', company: '', role: '' });
    setIsAddingExperience(false);
  };

  // Delete experience
  const handleDeleteExperience = (id) => {
    setExperienceList(experienceList.filter(exp => exp.id !== id));
  };

  // Add new education
  const handleAddEducation = () => {
    setEducationList([...educationList, { id: Date.now(), ...newEducation }]);
    setNewEducation({ dateFrom: '', dateTo: '', institution: '' });
    setIsAddingEducation(false);
  };

  // Delete education
  const handleDeleteEducation = (id) => {
    setEducationList(educationList.filter(edu => edu.id !== id));
  };

  // Save edited experience
  const handleSaveExperience = () => {
    setExperienceList(experienceList.map(exp => (exp.id === editExperience.id ? editExperience : exp)));
    setEditExperience(null);
  };

  // Save edited education
  const handleSaveEducation = () => {
    setEducationList(educationList.map(edu => (edu.id === editEducation.id ? editEducation : edu)));
    setEditEducation(null);
  };

  return (
    <div className="mt-4 bg-[#eaeaea] p-6 rounded-lg">
      {/* Experience Section */}
      <div className="mb-8">
        <h3 className="text-lg mb-4">Experience</h3>
        {experienceList.map(exp => (
          <div key={exp.id} className="bg-white p-4 mb-4 rounded-lg shadow-sm relative">
            <p onClick={() => setEditExperience(exp)} className="cursor-pointer">{exp.date}</p>
            <p onClick={() => setEditExperience(exp)} className="font-semibold cursor-pointer">{exp.company}</p>
            <p onClick={() => setEditExperience(exp)} className="cursor-pointer">{exp.role}</p>
            <button
              onClick={() => handleDeleteExperience(exp.id)}
              className="absolute top-4 right-4 text-orange-500 hover:text-orange-600">
              <FaTrash />
            </button>
          </div>
        ))}
        <button onClick={() => setIsAddingExperience(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px] transition-all">
          Add Experience
        </button>
      </div>

      {/* Education Section */}
      <div>
        <h3 className="text-lg mb-4">Education</h3>
        {educationList.map(edu => (
          <div key={edu.id} className="bg-white p-4 mb-4 rounded-lg shadow-sm relative">
            <p onClick={() => setEditEducation(edu)} className="cursor-pointer">{edu.date}</p>
            <p onClick={() => setEditEducation(edu)} className="font-semibold cursor-pointer">{edu.institution}</p>
            <button
              onClick={() => handleDeleteEducation(edu.id)}
              className="absolute top-4 right-4 text-orange-500 hover:text-orange-600">
              <FaTrash />
            </button>
          </div>
        ))}
        <button onClick={() => setIsAddingEducation(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px] transition-all">
          Add Education
        </button>
      </div>

      {/* Add Experience Modal */}
      {isAddingExperience && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="mb-6 text-xl font-semibold text-gray-800">Add Experience</h3>

            {/* From Date */}
            <div className="mb-4">
              <label htmlFor="from" className="block mb-1 text-sm text-gray-600">From</label>
              <input
                type="date"
                value={newExperience.dateFrom}
                onChange={(e) => setNewExperience({ ...newExperience, dateFrom: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* To Date */}
            <div className="mb-4">
              <label htmlFor="to" className="block mb-1 text-sm text-gray-600">To</label>
              <input
                type="date"
                value={newExperience.dateTo}
                onChange={(e) => setNewExperience({ ...newExperience, dateTo: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Company */}
            <div className="mb-4">
              <label htmlFor="company" className="block mb-1 text-sm text-gray-600">Company</label>
              <input
                type="text"
                value={newExperience.company}
                onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Company"
              />
            </div>

            {/* Role */}
            <div className="mb-6">
              <label htmlFor="role" className="block mb-1 text-sm text-gray-600">Role</label>
              <input
                type="text"
                value={newExperience.role}
                onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Role"
              />
            </div>

            {/* Save and Cancel Buttons */}
            <div className="flex justify-start space-x-4">
              <button
                onClick={handleAddExperience}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px] transition-all">
                Save
              </button>
              <button
                onClick={() => setIsAddingExperience(false)}
                className="text-gray-500 hover:text-gray-700 underline transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Education Modal */}
      {isAddingEducation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="mb-6 text-xl font-semibold text-gray-800">Add Education</h3>

            {/* From Date */}
            <div className="mb-4">
              <label htmlFor="from" className="block mb-1 text-sm text-gray-600">From</label>
              <input
                type="date"
                value={newEducation.dateFrom}
                onChange={(e) => setNewEducation({ ...newEducation, dateFrom: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* To Date */}
            <div className="mb-4">
              <label htmlFor="to" className="block mb-1 text-sm text-gray-600">To</label>
              <input
                type="date"
                value={newEducation.dateTo}
                onChange={(e) => setNewEducation({ ...newEducation, dateTo: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Institution */}
            <div className="mb-6">
              <label htmlFor="institution" className="block mb-1 text-sm text-gray-600">Institution</label>
              <input
                type="text"
                value={newEducation.institution}
                onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Institution"
              />
            </div>

            {/* Save and Cancel Buttons */}
            <div className="flex justify-start space-x-4">
              <button
                onClick={handleAddEducation}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px] transition-all">
                Save
              </button>
              <button
                onClick={() => setIsAddingEducation(false)}
                className="text-gray-500 hover:text-gray-700 underline transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Experience Modal */}
      {editExperience && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="mb-6 text-xl font-semibold text-gray-800">Edit Experience</h3>

            {/* From Date */}
            <div className="mb-4">
              <label htmlFor="from" className="block mb-1 text-sm text-gray-600">From</label>
              <input
                type="date"
                value={editExperience.dateFrom}
                onChange={(e) => setEditExperience({ ...editExperience, dateFrom: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* To Date */}
            <div className="mb-4">
              <label htmlFor="to" className="block mb-1 text-sm text-gray-600">To</label>
              <input
                type="date"
                value={editExperience.dateTo}
                onChange={(e) => setEditExperience({ ...editExperience, dateTo: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Company */}
            <div className="mb-4">
              <label htmlFor="company" className="block mb-1 text-sm text-gray-600">Company</label>
              <input
                type="text"
                value={editExperience.company}
                onChange={(e) => setEditExperience({ ...editExperience, company: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Company"
              />
            </div>

            {/* Role */}
            <div className="mb-6">
              <label htmlFor="role" className="block mb-1 text-sm text-gray-600">Role</label>
              <input
                type="text"
                value={editExperience.role}
                onChange={(e) => setEditExperience({ ...editExperience, role: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Role"
              />
            </div>

            {/* Save and Cancel Buttons */}
            <div className="flex justify-start space-x-4">
              <button
                onClick={handleSaveExperience}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px] transition-all">
                Save
              </button>
              <button
                onClick={() => setEditExperience(null)}
                className="text-gray-500 hover:text-gray-700 underline transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Education Modal */}
      {editEducation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="mb-6 text-xl font-semibold text-gray-800">Edit Education</h3>

            {/* From Date */}
            <div className="mb-4">
              <label htmlFor="from" className="block mb-1 text-sm text-gray-600">From</label>
              <input
                type="date"
                value={editEducation.dateFrom}
                onChange={(e) => setEditEducation({ ...editEducation, dateFrom: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* To Date */}
            <div className="mb-4">
              <label htmlFor="to" className="block mb-1 text-sm text-gray-600">To</label>
              <input
                type="date"
                value={editEducation.dateTo}
                onChange={(e) => setEditEducation({ ...editEducation, dateTo: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Institution */}
            <div className="mb-6">
              <label htmlFor="institution" className="block mb-1 text-sm text-gray-600">Institution</label>
              <input
                type="text"
                value={editEducation.institution}
                onChange={(e) => setEditEducation({ ...editEducation, institution: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Institution"
              />
            </div>

            {/* Save and Cancel Buttons */}
            <div className="flex justify-start space-x-4">
              <button
                onClick={handleSaveEducation}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px] transition-all">
                Save
              </button>
              <button
                onClick={() => setEditEducation(null)}
                className="text-gray-500 hover:text-gray-700 underline transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resume;