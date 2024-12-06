import React from 'react';

const AllCerificatesAndTrainings = ({ isOpen, onClose, certificates, trainings }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-4/5 max-w-2xl">
        {certificates && certificates.length > 0 && (
          <>
            <h2 className="text-lg font-semibold mb-4">All Certifications</h2>
            <div className="overflow-x-auto max-h-64">
              <table className="min-w-full border border-gray-300 bg-white rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 text-left font-semibold">Name</th>
                    <th className="border px-4 py-2 text-left font-semibold">Link</th>
                    <th className="border px-4 py-2 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((certificate) => (
                    <tr key={certificate.id}>
                      <td className="border px-4 py-2">{certificate.certificate_name}</td>
                      <td className="border px-4 py-2">
                        <a
                          href={certificate.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-blue-500"
                        >
                          View
                        </a>
                      </td>
                      <td className="border px-4 py-2">{certificate.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {trainings && trainings.length > 0 && (
          <>
            <h2 className="text-lg font-semibold mb-4">All Trainings</h2>
            <div className="overflow-x-auto max-h-64">
              <table className="min-w-full border border-gray-300 bg-white rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 text-left font-semibold">Training</th>
                    <th className="border px-4 py-2 text-left font-semibold">Weight</th>
                    <th className="border px-4 py-2 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {trainings.map((training) => (
                    <tr key={training.id}>
                      <td className="border px-4 py-2">{training.training}</td>
                      <td className="border px-4 py-2">{training.weight}</td>
                      <td className="border px-4 py-2">{training.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Show message if neither certificates nor trainings exist */}
        {(!certificates || certificates.length === 0) && (!trainings || trainings.length === 0) && (
          <p className="text-center text-gray-500">No data available to display.</p>
        )}

        <button
          onClick={onClose}
          className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AllCerificatesAndTrainings;