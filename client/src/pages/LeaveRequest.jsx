import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const LeaveRequest = () => {
    const empId = localStorage.getItem('empId');
    const [leaveRequest, setLeaveRequest] = useState({
        date_from: '',
        date_to: '',
        time_from: '',
        time_to: '',
        description: '',
    });
    const [leaveRequestList, setLeaveRequestList] = useState([]);
    const [filteredLeaveRequestList, setFilteredLeaveRequestList] = useState([]);
    const [yearFilter, setYearFilter] = useState('');
    const [monthFilter, setMonthFilter] = useState('');

    // Update leaveRequest state based on form inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLeaveRequest(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleNewRequest = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:4000/employees/requestLeave/${empId}`, leaveRequest);
            setLeaveRequestList(prev => [...prev, { ...leaveRequest, id: response.data.id }]);
            setLeaveRequest({ date_from: '', date_to: '', time_from: '', time_to: '', description: '' });
            alert('New leave request added successfully');
        } catch (err) {
            console.error("Error adding leave request:", err);
            alert('Error adding leave request!');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requestResponse = await axios.get(`http://localhost:4000/employees/getLeaveRequest/${empId}`);
                setLeaveRequestList(requestResponse.data);
                setFilteredLeaveRequestList(requestResponse.data);
            } catch (err) {
                console.log("Error fetching data:", err);
            }
        };
        fetchData();
    }, [empId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA');
    };

    const handleDelete = async (leaveId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this leave request?");

        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:4000/employees/deleteLeave/${empId}/${leaveId}`);
                setLeaveRequestList(prevList => prevList.filter(leave => leave.id !== leaveId));
                setFilteredLeaveRequestList(prevList => prevList.filter(leave => leave.id !== leaveId));
            } catch (error) {
                console.error("Error deleting leave request:", error);
                alert('Failed to delete leave request.');
            }
        } else {
            console.log('Deletion canceled.');
        }
    };

    // Handle filter changes
    const handleFilterChange = () => {
        const filteredList = leaveRequestList.filter((leave) => {
            const leaveDate = new Date(leave.date_from);
            const leaveYear = leaveDate.getFullYear();
            const leaveMonth = leaveDate.getMonth() + 1;

            const matchesYear = yearFilter ? leaveYear === parseInt(yearFilter) : true;
            const matchesMonth = monthFilter ? leaveMonth === parseInt(monthFilter) : true;

            return matchesYear && matchesMonth;
        });
        setFilteredLeaveRequestList(filteredList);
    };

    useEffect(() => {
        handleFilterChange();
    }, [yearFilter, monthFilter, leaveRequestList]);

    return (
        <div className="p-6 px-20 bg-[#eaeaea] rounded-lg shadow-md mx-10 my-10">
            {/* Leave Request Form */}
            <h2 className="text-xl mb-4">Request Leave</h2>
            <form className="space-y-4" onSubmit={handleNewRequest}>
                <div className="grid grid-cols-2 gap-4">
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
                        <label className="block text-gray-700">Time From</label>
                        <input
                            type="time"
                            name="time_from"
                            value={leaveRequest.time_from}
                            onChange={handleInputChange}
                            className="border-none rounded-md p-2 w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Time To</label>
                        <input
                            type="time"
                            name="time_to"
                            value={leaveRequest.time_to}
                            onChange={handleInputChange}
                            className="border-none rounded-md p-2 w-full"
                            required
                        />
                    </div>
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
                    Submit Leave Request
                </button>
            </form>

            {/* Filters */}
            <div className="flex space-x-4 mt-10">
                <div>
                    <label className="block text-gray-700">Filter by Year</label>
                    <select
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="border-none rounded-md p-2 w-full"
                    >
                        <option value="">All Years</option>
                        {[...new Set(leaveRequestList.map(leave => new Date(leave.date_from).getFullYear()))]
                            .sort((a, b) => b - a)
                            .map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))
                        }
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700">Filter by Month</label>
                    <select
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(e.target.value)}
                        className="border-none rounded-md p-2 w-full"
                    >
                        <option value="">All Months</option>
                        {Array.from({ length: 12 }, (_, index) => (
                            <option key={index + 1} value={index + 1}>
                                {new Date(0, index).toLocaleString('en-US', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Leave History */}
            <div className="mt-10">
                <h3 className="text-lg mb-4">Previous Leave Requests</h3>
                <table className="min-w-full bg-white border text-gray-600 rounded-lg">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Date From</th>
                            <th className="py-2 px-4 border-b">Date To</th>
                            <th className="py-2 px-4 border-b">Time From</th>
                            <th className="py-2 px-4 border-b">Time To</th>
                            <th className="py-2 px-4 border-b">Description</th>
                            <th className="py-2 px-4 border-b">Status</th>
                            <th className="py-2 px-4 border-b">Comments</th>
                            <th className="py-2 px-4 border-b">Action</th>
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        {filteredLeaveRequestList.length > 0 ? (
                            filteredLeaveRequestList.map((leave, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-4 border-b">{formatDate(leave.date_from)}</td>
                                    <td className="py-2 px-4 border-b">{formatDate(leave.date_to)}</td>
                                    <td className="py-2 px-4 border-b">{leave.time_from}</td>
                                    <td className="py-2 px-4 border-b">{leave.time_to}</td>
                                    <td className="py-2 px-4 border-b">{leave.description}</td>
                                    <td className="py-2 px-4 border-b">{leave.status}</td>
                                    <td className="py-2 px-4 border-b">{leave.comments || '-'}</td>
                                    <td className="py-2 px-4 border-b space-x-4">
                                        <button className='text-orange-500'
                                            onClick={(e) => {
                                                handleDelete(leave.id);
                                            }}
                                        >
                                            <FaTrash size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-4">No leave requests found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaveRequest;