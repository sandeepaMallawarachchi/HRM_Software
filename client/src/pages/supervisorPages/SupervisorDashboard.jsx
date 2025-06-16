import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AssignedEmployeeModal from './AssignedEmployeeModal';

const SupervisorDashboard = () => {
    const empId = localStorage.getItem('empId');
    const [assignedEmployees, setAssignedEmployees] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmpId, setSelectedEmpId] = useState(null);

    useEffect(() => {
        const fetchAssignedEmployees = async () => {
            try {
                const res = await axios.get(`https://global-hrm-mobile-server.vercel.app/admin/getAssignedEmployees/${empId}`);
                setAssignedEmployees(res.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchAssignedEmployees();
    }, [empId]);

    const openModal = (empId) => {
        setSelectedEmpId(empId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedEmpId(null);
        setIsModalOpen(false);
    };

    return (
        <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Assigned Employees</h3>
            <table className="min-w-full bg-white border border-gray-200 mb-4">
                <thead>
                    <tr>
                        <th className="border-b px-4 py-2">Employee Id</th>
                        <th className="border-b px-4 py-2">Employee Name</th>
                        <th className="border-b px-4 py-2">Designation</th>
                        <th className="border-b px-4 py-2">Department</th>
                        <th className="border-b px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {assignedEmployees.map((emp) => (
                        <tr key={emp.id}>
                            <td className="border-b px-4 py-2">{emp.empId}</td>
                            <td className="border-b px-4 py-2">{emp.NAME}</td>
                            <td className="border-b px-4 py-2">{emp.designation}</td>
                            <td className="border-b px-4 py-2">{emp.department}</td>
                            <td className="border-b px-4 py-2">
                                <button
                                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700"
                                    onClick={() => openModal(emp.empId)}
                                >
                                    Go Through
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && (
                <AssignedEmployeeModal
                    onClose={closeModal}
                    selectedEmpId={selectedEmpId}
                />
            )}
        </div>
    );
};

export default SupervisorDashboard;