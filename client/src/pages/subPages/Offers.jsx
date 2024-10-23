import React from "react";

const OffersEmployee = () => {
  const offers = [
    {
      id: 1,
      position: "Software Engineer",
      salary: "$80,000",
      benefits: "Health, Dental, 401K",
      status: "Accepted",
    },
    {
      id: 2,
      position: "Project Manager",
      salary: "$95,000",
      benefits: "Health, Dental, Stock Options",
      status: "Pending",
    },
    {
      id: 3,
      position: "UX Designer",
      salary: "$75,000",
      benefits: "Health, 401K",
      status: "Declined",
    },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Job Offers</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Position</th>
              <th className="py-3 px-6 text-left">Salary</th>
              <th className="py-3 px-6 text-left">Benefits</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {offers.map((offer) => (
              <tr
                key={offer.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left">{offer.position}</td>
                <td className="py-3 px-6 text-left">{offer.salary}</td>
                <td className="py-3 px-6 text-left">{offer.benefits}</td>
                <td
                  className={`py-3 px-6 text-left ${
                    offer.status === "Accepted"
                      ? "text-green-500"
                      : offer.status === "Declined"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  {offer.status}
                </td>
                <td className="py-3 px-6 text-center">
                  {offer.status === "Pending" && (
                    <div className="flex justify-center">
                      <button className="bg-green-500 text-white px-4 py-2 rounded-full text-sm mr-2 hover:bg-green-600 transition-all">
                        Accept
                      </button>
                      <button className="bg-red-500 text-white px-4 py-2 rounded-full text-sm hover:bg-red-600 transition-all">
                        Decline
                      </button>
                    </div>
                  )}
                  {offer.status !== "Pending" && (
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600 transition-all">
                      View Offer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OffersEmployee;
