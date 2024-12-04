import React, { useEffect, useState } from "react";
import { FaUserCheck, FaUserTimes } from "react-icons/fa";
import axios from "axios";

const NewResourceAllocation = ({ selectedResourceId, selectedResource, selectedResourceQuantity, onClose }) => {
    const [employeeList, setEmployeeList] = useState([]);
    const [filteredEmployeeList, setFilteredEmployeeList] = useState([]);
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [designationFilter, setDesignationFilter] = useState("");
    const [nameSearch, setNameSearch] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [allocatedDate, setAllocatedDate] = useState("");
    const [returnedDate, setReturnedDate] = useState("");
    const [quantity, setQuantity] = useState(1);
    const today = new Date().toISOString().split('T')[0];

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
            const matchesName = nameSearch
                ? employee.name.toLowerCase().includes(nameSearch.toLowerCase())
                : true;
            const matchesDepartment = departmentFilter
                ? employee.department.toLowerCase() === departmentFilter.toLowerCase()
                : true;
            const matchesDesignation = designationFilter
                ? employee.designation.toLowerCase() === designationFilter.toLowerCase()
                : true;

            return matchesName && matchesDepartment && matchesDesignation;
        });
        setFilteredEmployeeList(filteredList);
    };

    useEffect(() => {
        handleFilterChange();
    }, [nameSearch, departmentFilter, designationFilter, employeeList]);

    // const handleSelectEmployee = (employee) => {
    //     setSelectedEmployee(employee);
    // };

    const handleSelectEmployee = (employee) => {
        if (selectedEmployee?.empId === employee.empId) {
            setSelectedEmployee(null);
        } else if (!selectedEmployee) {
            setSelectedEmployee(employee);
        }
    };

    const handleSave = async () => {
        if (!selectedEmployee || !allocatedDate || !returnedDate || !selectedResource) {
            alert("Please fill all the required fields.");
            return;
        }

        const allocationData = {
            id: selectedResourceId,
            empId: selectedEmployee.empId,
            resource: selectedResource,
            quantity: quantity,
            allocatedate: allocatedDate,
            returneddate: returnedDate,
        };

        try {
            await axios.post(`http://localhost:4000/admin/allocateResource/${selectedEmployee.empId}`, allocationData);
            alert("Resource allocated successfully!");
            onClose();
        } catch (error) {
            console.error("Error allocating resource:", error);
            alert("Failed to allocate resource.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-8 w-2/3 shadow-lg max-h-[95vh] overflow-y-auto">
                <h2 className="text-2xl font-semibold mb-4">Allocate Resource</h2>
                <div className="flex space-x-4 mt-5">
                    <div>
                        <label className="block text-gray-700">Search by Name</label>
                        <input
                            type="text"
                            value={nameSearch}
                            onChange={(e) => setNameSearch(e.target.value)}
                            className="border-gray-300 rounded-md p-2 w-full"
                            placeholder="Enter employee's name"
                        />
                    </div>
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
                    <h3 className="text-lg mb-4">Employee Details <span className="text-sm text-red-600">* select only one employee at once</span></h3>
                    <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
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
                                                    onClick={() => handleSelectEmployee(employee)}
                                                    className={`flex justify-center items-center ${selectedEmployee?.empId === employee.empId
                                                        ? "text-red-500 hover:text-red-700"
                                                        : "text-green-500 hover:text-green-700"
                                                        }`}
                                                >
                                                    {selectedEmployee?.empId === employee.empId ? (
                                                        <FaUserTimes size={20} />
                                                    ) : (
                                                        <FaUserCheck size={20} />
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
                <div className="mt-6">
                    <label className="block text-gray-700 mb-2">Allocate Date</label>
                    <input
                        type="date"
                        value={allocatedDate}
                        min={today}
                        onChange={(e) => setAllocatedDate(e.target.value)}
                        className="border-gray-300 rounded-md p-2 w-full"
                    />
                    <label className="block text-gray-700 mt-4 mb-2">Return Date</label>
                    <input
                        type="date"
                        value={returnedDate}
                        min={today}
                        onChange={(e) => setReturnedDate(e.target.value)}
                        className="border-gray-300 rounded-md p-2 w-full"
                    />
                </div>
                <div className="mt-6">
                    <label className="block text-gray-700 mb-2">Quantity</label>
                    <input
                        type="number"
                        min="1"
                        max={selectedResourceQuantity}
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="border-gray-300 rounded-md p-2 w-full"
                    />
                </div>
                <div className="flex justify-start mt-6 space-x-4">
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

export default NewResourceAllocation;