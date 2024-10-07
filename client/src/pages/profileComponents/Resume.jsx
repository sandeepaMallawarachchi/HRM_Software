import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaTrash, FaBuilding, FaUniversity } from 'react-icons/fa';

const Resume = () => {
  
  const empId = localStorage.getItem("empId");
  const [experienceList, setExperienceList] = useState([]);
  const [newExperience, setNewExperience] = useState({ date_from: '', date_to: '', company: '', role: '' });
  const [editExperience, setEditExperience] = useState(null);
  const [isAddingExperience, setIsAddingExperience] = useState(false);

  const [educationList, setEducationList] = useState([]);
  const [newEducation, setNewEducation] = useState({ date_from: '', date_to: '', institution: '', degree: '' });
  const [editEducation, setEditEducation] = useState(null);
  const [isAddingEducation, setIsAddingEducation] = useState(false);

  // Fetch experiences and education when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const experienceResponse = await axios.get(`http://localhost:4000/employees/getExperience/${empId}`);
        setExperienceList(experienceResponse.data);

        const educationResponse = await axios.get(`http://localhost:4000/employees/getEducation/${empId}`);
        setEducationList(educationResponse.data);
      } catch (err) {
        console.log("Error fetching data:", err);
      }
    };
    fetchData();
  }, [empId]);

  //add experience
  const handleAddExperience = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/employees/experience/${empId}`, newExperience);
      setExperienceList(prev => [...prev, { ...newExperience, id: response.data.id }]); // Use the returned ID
      setNewExperience({ date_from: '', date_to: '', company: '', role: '' });
      setIsAddingExperience(false);
      alert('New experience added successfully');
    } catch (err) {
      console.error("Error adding experience:", err);
      alert('Error adding experience!');
    }
  };

  //add education
  const handleAddEducation = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/employees/education/${empId}`, newEducation);
      setEducationList(prev => [...prev, { ...newEducation, id: response.data.id }]); // Use the returned ID
      setNewEducation({ date_from: '', date_to: '', institution: '', degree: '' });
      setIsAddingEducation(false);
      alert('New education added successfully');
    } catch (err) {
      console.error("Error adding education:", err);
      alert('Error adding education!');
    }
  };

  // Handle updating the experience
  const handleUpdateExperience = async () => {
    try {
      const response = await axios.put(`http://localhost:4000/employees/updateExperience/${empId}/${editExperience.id}`, editExperience);
      setExperienceList(prev =>
        prev.map(exp => (exp.id === editExperience.id ? response.data : exp)) // Update the correct experience
      );
      setEditExperience(null);
      alert('Experience updated successfully!');
    } catch (error) {
      console.error('Error updating experience:', error);
      alert('Failed to update experience.');
    }
  };

  // Handle updating the education
  const handleUpdateEducation = async () => {
    try {
      const response = await axios.put(`http://localhost:4000/employees/updateEducation/${empId}/${editEducation.id}`, editEducation);
      setEducationList(prev =>
        prev.map(edu => (edu.id === editEducation.id ? response.data : edu)) // Update the correct experience
      );
      setEditEducation(null);
      alert('Education updated successfully!');
    } catch (error) {
      console.error('Error updating education:', error);
      alert('Failed to update education.');
    }
  };

  // Handle deleting the experience
  const handleDeleteExperience = async (expId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this experience?");

    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:4000/employees/deleteExperience/${empId}/${expId}`);
        setExperienceList(prev => prev.filter(exp => exp.id !== expId));
        alert('Experience deleted successfully.');
      } catch (error) {
        console.error("Error deleting experience:", error);
        alert('Failed to delete experience.');
      }
    } else {
      console.log('Deletion canceled.');
    }
  };

  // Handle deleting the education
  const handleDeleteEducation = async (eduId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this education?");

    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:4000/employees/deleteEducation/${empId}/${eduId}`);
        setEducationList(prev => prev.filter(edu => edu.id !== eduId));
        alert('Education deleted successfully.');
      } catch (error) {
        console.error("Error deleting education:", error);
        alert('Failed to delete education.');
      }
    } else {
      console.log('Deletion canceled.');
    }
  };

  // Handle selecting experience for editing
  const handleExperienceEditClick = (exp) => {
    const formattedExp = {
      ...exp,
      date_from: new Date(exp.date_from).toISOString().split('T')[0],
      date_to: exp.date_to ? new Date(exp.date_to).toISOString().split('T')[0] : null, // Handle null case
    };

    setEditExperience(formattedExp);
  };

   // Handle selecting education for editing
   const handleEducationEditClick = (edu) => {
    const formattedEdu = {
      ...edu,
      date_from: new Date(edu.date_from).toISOString().split('T')[0],
      date_to: edu.date_to ? new Date(edu.date_to).toISOString().split('T')[0] : null, // Handle null case
    };

    setEditEducation(formattedEdu);
  };

  return (
    <div className="mt-4 bg-[#eaeaea] p-6 rounded-lg">
      {/* Experience Section */}
      <div className="mb-8">
        <h3 className="text-lg mb-4 text-gray-500">Experience</h3>
        {experienceList.map(exp => (
          <div key={exp.id} onClick={() => handleExperienceEditClick(exp)} className="bg-white p-4 mb-4 rounded-lg shadow-sm relative cursor-pointer">
            <div className="flex items-center">
              <FaBuilding className="text-4xl text-gray-400 mr-10" />
              <div>
                <p className="font-semibold text-lg">{exp.company}</p>
                <p>{exp.role}</p>
                <p>{new Date(exp.date_from).toLocaleDateString()} to {exp.date_to ? new Date(exp.date_to).toLocaleDateString() : 'Current'}</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the edit click when deleting
                handleDeleteExperience(exp.id); // Pass the experience ID to delete
              }}
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
      <div className="mb-8">
        <h3 className="text-lg mb-4 text-gray-500">Education</h3>
        {educationList.map(edu => (
          <div key={edu.id} onClick={() => handleEducationEditClick(edu)} className="bg-white p-4 mb-4 rounded-lg shadow-sm relative cursor-pointer">
            <div className="flex items-center">
              <FaUniversity className="text-4xl text-gray-400 mr-10" />
              <div>
                <p className="font-semibold text-lg">{edu.institution}</p>
                <p>{edu.degree}</p>
                <p>{new Date(edu.date_from).toLocaleDateString()} to {edu.date_to ? new Date(edu.date_to).toLocaleDateString() : 'Current'}</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the edit click when deleting
                handleDeleteEducation(edu.id); // Pass the experience ID to delete
              }}
              className="absolute top-4 right-4 text-orange-500 hover:text-orange-600">
              <FaTrash />
            </button>
          </div>
        ))}
        <button onClick={() => setIsAddingEducation(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px] transition-all">
          Add Education
        </button>
      </div>

      {/* Modals for Adding and Editing Experience */}
      {isAddingExperience && (
        <Modal title="Add Experience" onClose={() => setIsAddingExperience(false)}>
          <ExperienceForm
            data={newExperience}
            setData={setNewExperience}
            onSubmit={handleAddExperience}
            isEdit={false}
          />
        </Modal>
      )}
      {editExperience && (
        <Modal title="Edit Experience" onClose={() => setEditExperience(null)}>
          <ExperienceForm
            data={editExperience}
            setData={setEditExperience}
            onSubmit={handleUpdateExperience}
            isEdit={true}
          />
        </Modal>
      )}

      {/* Modals for Adding and Editing Education */}
      {isAddingEducation && (
        <Modal title="Add Education" onClose={() => setIsAddingEducation(false)}>
          <EducationForm
            data={newEducation}
            setData={setNewEducation}
            onSubmit={handleAddEducation}
            isEdit={false}
          />
        </Modal>
      )}
      {editEducation && (
        <Modal title="Edit Education" onClose={() => setEditEducation(null)}>
          <EducationForm
            data={editEducation}
            setData={setEditEducation}
            onSubmit={handleUpdateEducation}
            isEdit={true}
          />
        </Modal>
      )}
    </div>
  );
};

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
      <h3 className="mb-6 text-xl font-semibold text-gray-800">{title}</h3>
      {children}
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700 hover:underline transition-all ml-5">Close</button>
    </div>
  </div>
);

//experience form
const ExperienceForm = ({ data, setData, onSubmit, isEdit, isCurrent, handleToggleCurrent }) => {
  return (
    <>
      <InputField 
        label="Company" 
        type="text" 
        placeholder='Enter your company' 
        value={data.company} 
        onChange={(e) => setData({ ...data, company: e.target.value })} 
      />
      <InputField 
        label="Role" 
        type="text" 
        placeholder='Enter your role' 
        value={data.role} 
        onChange={(e) => setData({ ...data, role: e.target.value })} 
      />
      <InputField 
        label="From" 
        type="date" 
        value={data.date_from} 
        onChange={(e) => setData({ ...data, date_from: e.target.value })} 
      />

      <div className="flex items-center mb-4">
        <InputField
          label="To"
          type="date"
          value={isCurrent ? 'Current' : data.date_to || ''}
          onChange={(e) => setData({ ...data, date_to: e.target.value })}
          disabled={isCurrent}
        />
        <label className="ml-3 flex items-center">
          <input
            type="checkbox"
            checked={isCurrent}
            onChange={handleToggleCurrent}
            className="mr-1"
          />
          <span className={`text-gray-700 ${isCurrent ? 'font-bold' : ''}`}>Current</span>
        </label>
      </div>

      <button 
        onClick={onSubmit} 
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px] transition-all"
      >
        {isEdit ? 'Update' : 'Add'}
      </button>
    </>
  );
};

//education form
const EducationForm = ({ data, setData, onSubmit, isEdit, isCurrent, handleToggleCurrent }) => {
  return (
    <>
      <InputField 
        label="Institution" 
        type="text" 
        placeholder='Enter your institution' 
        value={data.institution} 
        onChange={(e) => setData({ ...data, institution: e.target.value })} 
      />
      <InputField 
        label="Degree" 
        type="text" 
        placeholder='Enter your degree' 
        value={data.degree} 
        onChange={(e) => setData({ ...data, degree: e.target.value })} 
      />
      <InputField 
        label="From" 
        type="date" 
        value={data.date_from} 
        onChange={(e) => setData({ ...data, date_from: e.target.value })} 
      />

      <div className="flex items-center mb-4">
        <InputField
          label="To"
          type="date"
          value={isCurrent ? 'Current' : data.date_to || ''}
          onChange={(e) => setData({ ...data, date_to: e.target.value })}
          disabled={isCurrent}
        />
        <label className="ml-3 flex items-center">
          <input
            type="checkbox"
            checked={isCurrent}
            onChange={handleToggleCurrent}
            className="mr-1"
          />
          <span className={`text-gray-700 ${isCurrent ? 'font-bold' : ''}`}>Current</span>
        </label>
      </div>

      <button 
        onClick={onSubmit} 
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px] transition-all"
      >
        {isEdit ? 'Update' : 'Add'}
      </button>
    </>
  );
};

const InputField = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-gray-700 mb-1">{label}</label>
    <input className="border rounded-lg w-full px-3 py-2" {...props} />
  </div>
);

export default Resume;
