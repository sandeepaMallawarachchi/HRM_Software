import React, { useEffect, useState } from "react";
import axios from "axios";

const CheckLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");

  const loggedInEmpId = localStorage.getItem("empId"); // 👈 get logged-in user ID

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:4000/leaves/all");
      setLeaves(res.data);
    } catch (err) {
      console.error("Error fetching leave data:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:4000/leaves/update-status/${id}`, {
        status: newStatus,
      });
      fetchLeaves();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const filteredLeaves = leaves
    .filter((leave) => leave.empId !== loggedInEmpId) // 👈 exclude logged-in user's data
    .filter((leave) => {
      const matchSearch =
        leave.empId.toLowerCase().includes(search.toLowerCase()) ||
        leave.leave_type.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "All" || leave.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date_from);
      const dateB = new Date(b.date_from);
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Check Leaves</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by employee or leave type"
          className="border px-4 py-2 w-full sm:w-[300px] rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border px-4 py-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
        <select
          className="border px-4 py-2 rounded"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="Newest">Sort by Newest</option>
          <option value="Oldest">Sort by Oldest</option>
        </select>
      </div>

      <div className="overflow-auto max-h-[70vh]">
        <table className="w-full border-collapse border">
          <thead className="bg-orange-100 text-left">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Employee ID</th>
              <th className="p-2 border">Leave Type</th>
              <th className="p-2 border">From</th>
              <th className="p-2 border">To</th>
              <th className="p-2 border">Time</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.map((leave) => (
              <tr key={leave.id}>
                <td className="p-2 border">{leave.id}</td>
                <td className="p-2 border">{leave.empId}</td>
                <td className="p-2 border">{leave.leave_type}</td>
                <td className="p-2 border">{formatDate(leave.date_from)}</td>
                <td className="p-2 border">{formatDate(leave.date_to)}</td>
                <td className="p-2 border">
                  {leave.time_from} - {leave.time_to}
                </td>
                <td className="p-2 border">{leave.status}</td>
                <td className="p-2 border">
                  {new Date(leave.date_to) < new Date() ? (
                    <span className="text-gray-500 italic">Locked</span>
                  ) : (
                    <select
                      className="border px-2 py-1 rounded"
                      value={leave.status}
                      onChange={(e) =>
                        handleStatusChange(leave.id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
            {filteredLeaves.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  No matching leave requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CheckLeaves;
