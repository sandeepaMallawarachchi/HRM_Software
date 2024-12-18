import React, { useState, useEffect } from "react";
import axios from "axios";

const Documentations = () => {
  const [financialRequests, setFinancialRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all financial requests from the backend
  useEffect(() => {
    const fetchFinancialRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/employees/getFinancialRequests" // Fetch all financial requests
        );
        setFinancialRequests(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching financial requests:", error);
        setLoading(false);
      }
    };

    fetchFinancialRequests();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/employees/updateFinancialRequestStatus/${requestId}`, // Use requestId to update status
        { status: newStatus }
      );
      // Update the status in the UI after successful update
      setFinancialRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId ? { ...request, status: newStatus } : request
        )
      );
      alert("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4 text-xl text-gray-700">
        Loading financial requests...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Financial Requests
      </h2>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left text-sm font-semibold text-gray-700">
                Request ID
              </th>
              <th className="border p-3 text-left text-sm font-semibold text-gray-700">
                Employee ID
              </th>
              <th className="border p-3 text-left text-sm font-semibold text-gray-700">
                Request Type
              </th>
              <th className="border p-3 text-left text-sm font-semibold text-gray-700">
                Amount
              </th>
              <th className="border p-3 text-left text-sm font-semibold text-gray-700">
                Date of Request
              </th>
              <th className="border p-3 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="border p-3 text-left text-sm font-semibold text-gray-700">
                Attachment
              </th>
              <th className="border p-3 text-left text-sm font-semibold text-gray-700">
                Update Status
              </th>
            </tr>
          </thead>
          <tbody>
            {financialRequests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="border p-3 text-sm text-gray-600">
                  {request.id}
                </td>
                <td className="border p-3 text-sm text-gray-600">
                  {request.empId}
                </td>
                <td className="border p-3 text-sm text-gray-600">
                  {request.request_type}
                </td>
                <td className="border p-3 text-sm text-gray-600">
                  {request.amount}
                </td>
                <td className="border p-3 text-sm text-gray-600">
                  {request.date_of_request}
                </td>
                <td className="border p-3 text-sm text-gray-600">
                  {request.status}
                </td>
                <td className="border p-3 text-sm text-gray-600">
                  {request.attachment ? (
                    <a
                      href={request.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Attachment
                    </a>
                  ) : (
                    <span className="text-gray-500">No Attachment</span>
                  )}
                </td>
                <td className="border p-3">
                  <select
                    value={request.status}
                    onChange={(e) =>
                      handleStatusUpdate(request.id, e.target.value)
                    }
                    className="p-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Documentations;
