import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const Resume = () => {
  const [experienceList, setExperienceList] = useState([]);
  const [newExperience, setNewExperience] = useState({ date_from: '', date_to: '', company: '', role: '' });
  const [editExperience, setEditExperience] = useState(null);
  const [isAddingExperience, setIsAddingExperience] = useState(false);

  const empId = "emp1";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/employees/getExperience/${empId}`);
        setExperienceList(response.data);
      } catch (err) {
        console.log("Error fetching data:", err);
      }
    };
    fetchData();
  }, [empId]);

  const handleAddExperience = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/employees/experience/${empId}`, newExperience);
      setExperienceList(prev => [...prev, { ...newExperience, id: response.data.id }]);
      setNewExperience({ date_from: '', date_to: '', company: '', role: '' });
      setIsAddingExperience(false);
      alert('New experience added successfully');
    } catch (err) {
      console.error("Error adding experience:", err);
      alert('Error adding experience!');
    }
  };

  const handleUpdateExperience = async () => {
    try {
      const response = await axios.put(`http://localhost:4000/employees/updateExperience/${empId}/${editExperience.id}`, editExperience);
      setExperienceList(prev => prev.map(exp => (exp.id === response.data.id ? response.data : exp)));
      setEditExperience(null);
      alert('Experience updated successfully!');
    } catch (error) {
      console.error('Error updating experience:', error);
      alert('Failed to update experience.');
    }
  };

  const handleDeleteExperience = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/employees/deleteExperience/${id}`);
      setExperienceList(prev => prev.filter(exp => exp.id !== id));
    } catch (error) {
      console.error("Error deleting experience:", error);
      alert('Failed to delete experience.');
    }
  };

  const handleEditClick = (exp) => {
    const formattedExp = {
      ...exp,
      date_from: new Date(exp.date_from).toISOString().split('T')[0],
      date_to: new Date(exp.date_to).toISOString().split('T')[0],
    };
    setEditExperience(formattedExp);
  };

  return (
    <div className="mt-4 bg-[#eaeaea] p-6 rounded-lg">
      {/* Experience Section */}
      <div className="mb-8">
        <h3 className="text-lg mb-4 text-gray-500">Experience</h3>
        {experienceList.map(exp => (
          <div key={exp.id} onClick={() => handleEditClick(exp)} className="bg-white p-4 mb-4 rounded-lg shadow-sm relative cursor-pointer">
            <p>{new Date(exp.date_from).toLocaleDateString()} to {new Date(exp.date_to).toLocaleDateString()}</p>
            <p className="font-semibold">{exp.company}</p>
            <p>{exp.role}</p>
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

      {/* Modals for Adding and Editing Experience */}
      {isAddingExperience && (
        <Modal title="Add Experience" onClose={() => setIsAddingExperience(false)}>
          <Form
            data={newExperience}
            setData={setNewExperience}
            onSubmit={handleAddExperience}
            isEdit={false}
          />
        </Modal>
      )}
      {editExperience && (
        <Modal title="Edit Experience" onClose={() => setEditExperience(null)}>
          <Form
            data={editExperience}
            setData={setEditExperience}
            onSubmit={handleUpdateExperience}
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

const Form = ({ data, setData, onSubmit, isEdit }) => (
  <>
    <InputField label="From" type="date" value={data.date_from} onChange={(e) => setData({ ...data, date_from: e.target.value })} />
    <InputField label="To" type="date" value={data.date_to} onChange={(e) => setData({ ...data, date_to: e.target.value })} />
    <InputField label="Company" type="text" value={data.company} onChange={(e) => setData({ ...data, company: e.target.value })} />
    <InputField label="Role" type="text" value={data.role} onChange={(e) => setData({ ...data, role: e.target.value })} />
    <button onClick={onSubmit} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px] transition-all">
      {isEdit ? 'Update' : 'Add'}
    </button>
  </>
);

const InputField = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-gray-700 mb-1">{label}</label>
    <input className="border rounded-lg w-full px-3 py-2" {...props} />
  </div>
);

export default Resume;
