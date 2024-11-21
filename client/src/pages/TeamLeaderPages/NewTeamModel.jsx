import React, { useEffect, useState } from "react";
import { FaUserPlus, FaUserMinus } from "react-icons/fa";
import axios from "axios";

const NewTeamModel = ({ onClose }) => {
    const [employeeList, setEmployeeList] = useState([]);
    const [filteredEmployeeList, setFilteredEmployeeList] = useState([]);
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [designationFilter, setDesignationFilter] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [teamName, setTeamName] = useState("");
    const creatorEmpId = localStorage.getItem('empId');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:4000/admin/getAllEmployee");
                setEmployeeList(response.data);
                setFilteredEmployeeList(response.data);
            } catch (error) {
                console.error("Error fetching employee details:", error);
            }
        };
        fetchData();
    }, []);

    const handleFilterChange = () => {
        const filteredList = employeeList.filter((employee) => {
            const matchesDepartment = departmentFilter
                ? employee.department.toLowerCase() === departmentFilter.toLowerCase()
                : true;
            const matchesDesignation = designationFilter
                ? employee.designation.toLowerCase() === designationFilter.toLowerCase()
                : true;

            return matchesDepartment && matchesDesignation;
        });
        setFilteredEmployeeList(filteredList);
    };

    useEffect(() => {
        handleFilterChange();
    }, [departmentFilter, designationFilter, employeeList]);

    const handleToggleMember = (employeeId) => {
        setSelectedMembers((prevMembers) =>
            prevMembers.includes(employeeId)
                ? prevMembers.filter((id) => id !== employeeId)
                : [...prevMembers, employeeId]
        );
    };

    const handleSave = async () => {
        try {
            const membersWithDetails = selectedMembers.map((empId) => {
                const employee = employeeList.find(emp => emp.empId === empId);
                return {
                    empId,
                    name: employee?.name,
                    role: employee?.role,
                    department: employee?.department
                };
            });

            const newTeamData = {
                teamName,
                creator: creatorEmpId,
                members: membersWithDetails,
            };

            await axios.post(`http://localhost:4000/admin/createTeam/${creatorEmpId}`, newTeamData);
            alert("Team created and members added successfully!");
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert(error.response.data.error);
            } else {
                console.error("Error creating team:", error);
                alert("An error occurred while creating the team.");
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-8 w-2/3 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Create New Team</h2>
                <div className="mb-5">
                    <label className="block text-gray-700">Team Name</label>
                    <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="border-gray-300 rounded-md p-2 w-full"
                        required
                    />
                </div>
                <div className="flex space-x-4 mt-5">
                    <div>
                        <label className="block text-gray-700">Filter by Department</label>
                        <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="border-gray-300 rounded-md p-2 w-full"
                        >
                            <option value="">All Departments</option>
                            {[...new Set(employeeList.map((emp) => emp.department))].sort().map((dept) => (
                                <option key={dept} value={dept}>
                                    {dept}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700">Filter by Designation</label>
                        <select
                            value={designationFilter}
                            onChange={(e) => setDesignationFilter(e.target.value)}
                            className="border-gray-300 rounded-md p-2 w-full"
                        >
                            <option value="">All Designations</option>
                            {[...new Set(employeeList.map((emp) => emp.designation))].sort().map((designation) => (
                                <option key={designation} value={designation}>
                                    {designation}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="mt-10">
                    <h3 className="text-lg mb-4">Employee Details</h3>
                    <div className="overflow-y-auto" style={{ maxHeight: '300px' }}>
                        <table className="min-w-full bg-white border text-gray-600 rounded-lg">
                            <thead className="text-center">
                                <tr>
                                    <th className="py-2 px-4 border-b">Name</th>
                                    <th className="py-2 px-4 border-b">Role</th>
                                    <th className="py-2 px-4 border-b">Department</th>
                                    <th className="py-2 px-4 border-b">Designation</th>
                                    <th className="py-2 px-4 border-b">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployeeList.length > 0 ? (
                                    filteredEmployeeList.map((employee) => (
                                        <tr key={employee.empId}>
                                            <td className="py-2 px-4 border-b">{employee.name}</td>
                                            <td className="py-2 px-4 border-b">{employee.role}</td>
                                            <td className="py-2 px-4 border-b">{employee.department}</td>
                                            <td className="py-2 px-4 border-b">{employee.designation}</td>
                                            <td className="py-2 px-4 border-b">
                                                <button
                                                    onClick={() => handleToggleMember(employee.empId)}
                                                    className={`flex justify-center items-center ${selectedMembers.includes(employee.empId)
                                                        ? "text-red-500 hover:text-red-700"
                                                        : "text-green-500 hover:text-green-700"
                                                        }`}
                                                >
                                                    {selectedMembers.includes(employee.empId) ? (
                                                        <FaUserMinus size={20} />
                                                    ) : (
                                                        <FaUserPlus size={20} />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">
                                            No employee details found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex justify-start mt-4 space-x-4">
                    <button onClick={handleSave} className="px-4 py-2 bg-orange-500 text-white rounded-lg">
                        Save
                    </button>
                    <button onClick={onClose} className="px-4 py-2 text-gray-500 hover:underline">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewTeamModel;