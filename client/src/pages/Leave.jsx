import React, { useState } from 'react';

const Leave = () => {
  const [leaveRequest, setLeaveRequest] = useState({
    from: '',
    to: '',
    description: '',
  });

  const [leaveHistory, setLeaveHistory] = useState([
    { from: '2023-09-01', to: '2023-09-05', description: 'Vacation', status: 'Approved' },
    { from: '2023-08-20', to: '2023-08-22', description: 'Medical Leave', status: 'Pending' },
    { from: '2023-07-10', to: '2023-07-12', description: 'Family Event', status: 'Rejected' },
  ]);

  const handleInputChange = (e) => {
    setLeaveRequest({
      ...leaveRequest,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, you can add logic to submit the form (e.g., sending to a server or API)
    setLeaveHistory([...leaveHistory, { ...leaveRequest, status: 'Pending' }]);
    setLeaveRequest({ from: '', to: '', description: '' }); // Reset form
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto mt-10">
      {/* Leave Request Form */}
      <h2 className="text-xl mb-4">Request Leave</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">From</label>
          <input
            type="date"
            name="from"
            value={leaveRequest.from}
            onChange={handleInputChange}
            className="border rounded-md p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">To</label>
          <input
            type="date"
            name="to"
            value={leaveRequest.to}
            onChange={handleInputChange}
            className="border rounded-md p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={leaveRequest.description}
            onChange={handleInputChange}
            className="border rounded-md p-2 w-full"
            placeholder="Describe the reason for your leave"
            required
          />
        </div>
        <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px]">
          Submit Leave Request
        </button>
      </form>

      {/* Leave History */}
      <div className="mt-10">
        <h3 className="text-lg mb-4">Previous Leave Requests</h3>
        <table className="min-w-full bg-white border text-gray-600">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">From</th>
              <th className="py-2 px-4 border-b">To</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveHistory.map((leave, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{leave.from}</td>
                <td className="py-2 px-4 border-b">{leave.to}</td>
                <td className="py-2 px-4 border-b">{leave.description}</td>
                <td className={`py-2 px-4 border-b ${
                    leave.status === 'Approved' ? 'text-green-500' :
                    leave.status === 'Pending' ? 'text-yellow-500' :
                    'text-red-500'
                  }`}
                >
                  {leave.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leave;
