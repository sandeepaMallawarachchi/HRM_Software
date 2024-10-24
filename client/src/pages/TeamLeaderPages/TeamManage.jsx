import React from "react";
import { FaUserEdit, FaTrashAlt, FaEye } from "react-icons/fa";

const teamData = [
  { id: 1, name: "John Doe", role: "Developer", department: "Engineering" },
  { id: 2, name: "Jane Smith", role: "UI/UX Designer", department: "Design" },
  {
    id: 3,
    name: "Alice Johnson",
    role: "Product Manager",
    department: "Product",
  },
  { id: 4, name: "Mark Brown", role: "HR Specialist", department: "HR" },
];

const TeamManage = () => {
  return (
    <div className="p-8 bg-gray-100 h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-700 mb-8">
        Team Management
      </h2>
      <div className="flex justify-center mb-6">
        <input
          type="text"
          className="p-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Search team member..."
        />
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-orange-400 text-white uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-left">Department</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {teamData.map((teamMember) => (
              <tr
                key={teamMember.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <span className="font-medium">{teamMember.name}</span>
                </td>
                <td className="py-3 px-6 text-left">
                  <span>{teamMember.role}</span>
                </td>
                <td className="py-3 px-6 text-left">
                  <span>{teamMember.department}</span>
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center space-x-4">
                    <button className="text-blue-500 hover:text-blue-600">
                      <FaEye size={18} />
                    </button>
                    <button className="text-green-500 hover:text-green-600">
                      <FaUserEdit size={18} />
                    </button>
                    <button className="text-red-500 hover:text-red-600">
                      <FaTrashAlt size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamManage;
