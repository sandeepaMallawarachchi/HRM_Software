import React from "react";
import { FaTrash, FaEye,FaCheckCircle } from 'react-icons/fa';

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
    <div className="m-10 p-6 px-20 bg-[#eaeaea] rounded-lg shadow-md">
      <h3 className="text-lg mb-4">Your job offers</h3>
      <table className="min-w-full bg-white border text-gray-600 rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Position</th>
            <th className="py-2 px-4 border-b">Salary</th>
            <th className="py-2 px-4 border-b">Benefits</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {offers.map((offer) => (
            <tr key={offer.id}>
              <td className="py-2 px-4 border-b">{offer.position}</td>
              <td className="py-2 px-4 border-b">{offer.salary}</td>
              <td className="py-2 px-4 border-b">{offer.benefits}</td>
              <td
                className={`py-2 px-4 border-b ${offer.status === "Accepted"
                  ? "text-green-500"
                  : offer.status === "Declined"
                    ? "text-red-500"
                    : "text-yellow-500"
                  }`}
              >
                {offer.status}
              </td>
              <td className="py-2 px-4 border-b">
                {offer.status === "Pending" && (
                  <div className="flex justify-center gap-4">
                    <button className='text-orange-500'>
                      <FaCheckCircle size={24}/>
                    </button>
                    <button className='text-orange-500'>
                      <FaTrash size={24}/>
                    </button>
                  </div>
                )}
                {offer.status !== "Pending" && (
                  <button className='text-orange-500'>
                    <FaEye size={24}/>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OffersEmployee;
