import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Leave = () => {
  const [leaveRequest, setLeaveRequest] = useState({
    date_from: '',
    date_to: '',
    description: '',
  });
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // Track which request is being edited
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [confirmDelete, setConfirmDelete] = useState(false); // Confirmation for deletion
  const [deleteIndex, setDeleteIndex] = useState(null); // Track which request to delete
  const empId = localStorage.getItem('empId');

  // Fetch leave history from the API
  const fetchLeaveHistory = async () => {
    try {
      const response = await fetch(`http://localhost:4000/employees/getLeaveRequest/${empId}`);
      const data = await response.json();

      if (response.ok) {
        setLeaveHistory(data.reverse()); // Reverse to show latest first
      } else {
        console.error('Failed to fetch leave history:', data.message);
      }
    } catch (error) {
      console.error('Error fetching leave history:', error);
    }
  };

  // Call the fetchLeaveHistory function on component mount
  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  const handleInputChange = (e) => {
    setLeaveRequest({
      ...leaveRequest,
      [e.target.name]: e.target.value,
    });
  };

  // Handle leave request submission or update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      // If editing, handle update
      const updatedLeaveHistory = [...leaveHistory];
      updatedLeaveHistory[editIndex] = { ...leaveRequest, status: 'Pending', comments: '' };

      setLeaveHistory(updatedLeaveHistory);
      setEditIndex(null); // Reset the edit mode
      setShowModal(false); // Close modal after update
    } else {
      // New leave request
      try {
        const response = await fetch(`http://localhost:4000/employees/requestLeave/${empId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(leaveRequest),
        });

        const data = await response.json();

        if (response.ok) {
          // Add the new request to leave history
          setLeaveHistory([{ ...leaveRequest, status: 'Pending', comments: '' }, ...leaveHistory]);
          setLeaveRequest({ date_from: '', date_to: '', description: '' }); // Reset form
          console.log('Leave request submitted:', data.message);
        } else {
          console.error('Failed to submit leave request:', data.error);
        }
      } catch (error) {
        console.error('Error submitting leave request:', error);
      }
    }
  };

  // Handle editing a leave request
  const handleEdit = (index) => {
    const leaveToEdit = leaveHistory[index];
    setLeaveRequest(leaveToEdit); // Populate form with the request data
    setEditIndex(index); // Set the index to edit
    setShowModal(true); // Open modal for editing
  };

  // Handle opening delete confirmation dialog
  const handleDelete = (index) => {
    setDeleteIndex(index);
    setConfirmDelete(true);
  };

  // Confirm deletion of leave request
  const confirmDeletion = async () => {
    const leaveToDelete = leaveHistory[deleteIndex];
    try {
      // Make API call to delete leave from the database
      const response = await fetch(`http://localhost:4000/employees/deleteLeave/${leaveToDelete.empId}/${leaveToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedLeaveHistory = leaveHistory.filter((_, i) => i !== deleteIndex);
        setLeaveHistory(updatedLeaveHistory);
        console.log('Leave request deleted');
      } else {
        console.error('Failed to delete leave request');
      }
    } catch (error) {
      console.error('Error deleting leave request:', error);
    }
    setConfirmDelete(false); // Close confirmation dialog
    setDeleteIndex(null); // Reset delete index
  };

  const cancelDeletion = () => {
    setConfirmDelete(false); // Close confirmation dialog without deleting
    setDeleteIndex(null); // Reset delete index
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isEditable = (createdAt) => {
    const leaveCreatedAt = new Date(createdAt);
    const currentTime = new Date();
    const diffInMinutes = Math.floor((currentTime - leaveCreatedAt) / 1000 / 60);
    return diffInMinutes <= 30;
  };

  return (
    <div className="p-6 bg-[#eaeaea] rounded-lg shadow-md mx-10 mt-10">
      {/* Leave Request Form */}
      <h2 className="text-xl mb-4">{editIndex !== null ? 'Edit Leave Request' : 'Request Leave'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Date From</label>
          <input
            type="date"
            name="date_from"
            value={leaveRequest.date_from}
            onChange={handleInputChange}
            className="border-none rounded-md p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Date To</label>
          <input
            type="date"
            name="date_to"
            value={leaveRequest.date_to}
            onChange={handleInputChange}
            className="border-none rounded-md p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={leaveRequest.description}
            onChange={handleInputChange}
            className="border-none rounded-md p-2 w-full"
            placeholder="Describe the reason for your leave"
            required
          />
        </div>
        <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px]">
          {editIndex !== null ? 'Update Leave Request' : 'Submit Leave Request'}
        </button>
      </form>

      {/* Leave History */}
      <div className="mt-10">
        <h3 className="text-lg mb-4">Previous Leave Requests</h3>
        <table className="min-w-full bg-white border text-gray-600 rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Date From</th>
              <th className="py-2 px-4 border-b">Date To</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Comments</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody className='text-center'>
            {leaveHistory.length > 0 ? (
              leaveHistory.map((leave, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">{formatDate(leave.date_from)}</td>
                  <td className="py-2 px-4 border-b">{formatDate(leave.date_to)}</td>
                  <td className="py-2 px-4 border-b">{leave.description}</td>
                  <td
                    className={`py-2 px-4 border-b ${leave.status === 'Approved'
                      ? 'text-green-500'
                      : leave.status === 'Pending'
                        ? 'text-yellow-500'
                        : 'text-red-500'
                      }`}
                  >
                    {leave.status}
                  </td>
                  <td className="py-2 px-4 border-b">{leave.comments || '-'}</td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => handleEdit(index)} className={`text-orange-500 mr-2 ${!isEditable(leave.createdAt) && 'opacity-50 cursor-not-allowed'}`} disabled={!isEditable(leave.createdAt)}>
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(index)} className={`text-red-500 ${!isEditable(leave.createdAt) && 'opacity-50 cursor-not-allowed'}`} disabled={!isEditable(leave.createdAt)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-2 text-gray-600">No leave requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl mb-4">Edit Leave Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Date From</label>
                <input
                  type="date"
                  name="date_from"
                  value={leaveRequest.date_from}
                  onChange={handleInputChange}
                  className="border-none rounded-md p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Date To</label>
                <input
                  type="date"
                  name="date_to"
                  value={leaveRequest.date_to}
                  onChange={handleInputChange}
                  className="border-none rounded-md p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={leaveRequest.description}
                  onChange={handleInputChange}
                  className="border-none rounded-md p-2 w-full"
                  placeholder="Describe the reason for your leave"
                  required
                />
              </div>
              <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px]">
                Update Leave Request
              </button>
              <button type="button" onClick={() => setShowModal(false)} className="text-gray-500 ml-2">
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this leave request?</p>
            <div className="mt-4">
              <button onClick={confirmDeletion} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-[20px] mr-2">
                Yes
              </button>
              <button onClick={cancelDeletion} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-[20px]">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leave;