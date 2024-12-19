import React, { useState, useEffect } from "react";
import axios from "axios";

const Inprogress = () => {
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch approved financial requests from the backend
  useEffect(() => {
    const fetchApprovedRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/employees/getFinancialRequests"
        );
        // Filter requests with status "Approved"
        const filteredRequests = response.data.filter(
          (request) => request.status === "approved"
        );
        setApprovedRequests(filteredRequests);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching approved requests:", error);
        setLoading(false);
      }
    };

    fetchApprovedRequests();
  }, []);

  const openModal = (request) => {
    setSelectedRequest(request);
  };

  const closeModal = () => {
    setSelectedRequest(null);
  };

  if (loading) {
    return (
      <div className="text-center py-4 text-xl text-gray-700">
        Loading approved requests...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Approved Financial Requests
      </h2>

      {approvedRequests.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">
          No approved requests found.
        </div>
      ) : (
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
              </tr>
            </thead>
            <tbody>
              {approvedRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="border p-3 text-sm text-gray-600">
                    {request.id}
                  </td>
                  <td
                    className="border p-3 text-sm text-blue-600 hover:underline cursor-pointer"
                    onClick={() => openModal(request)}
                  >
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h3 className="text-xl font-bold mb-4">Employee Details</h3>
            <p>
              <strong>Employee ID:</strong> {selectedRequest.empId}
            </p>
            <p>
              <strong>Request ID:</strong> {selectedRequest.id}
            </p>
            <p>
              <strong>Request Type:</strong> {selectedRequest.request_type}
            </p>
            <p>
              <strong>Amount:</strong> {selectedRequest.amount}
            </p>
            <p>
              <strong>Date of Request:</strong>{" "}
              {selectedRequest.date_of_request}
            </p>
            <p>
              <strong>Status:</strong> {selectedRequest.status}
            </p>
            {selectedRequest.attachment && (
              <p>
                <strong>Attachment:</strong>{" "}
                <a
                  href={selectedRequest.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Attachment
                </a>
              </p>
            )}
            <button
              onClick={closeModal}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inprogress;
