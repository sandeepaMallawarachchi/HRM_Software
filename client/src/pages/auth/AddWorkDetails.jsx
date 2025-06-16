import React, { useState } from 'react'
import Supervisers from './Supervisers';
import { FaUserPlus } from "react-icons/fa";

const AddWorkDetails = () => {
    const [workFormData, setWorkFormData] = useState({
        empId: "",
        workEmail: "",
        workPhone: "",
        department: "",
        location: "",
        designation: "",
        supervisor: "",
    });
    const [isSupervisersModelOpen, setIsSupervisersModalOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setWorkFormData({ ...workFormData, [name]: value });
    };

    const handleWorkSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://global-hrm-mobile-server.vercel.app/employees/workDetails/${workFormData.empId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(workFormData),
                }
            );

            const data = await response.json();
            if (response.ok) {
                console.log("Adding work details successful:", data);
                alert("Work details submitted successfully");
                setWorkFormData({
                    empId: "",
                    workEmail: "",
                    workPhone: "",
                    department: "",
                    location: "",
                    designation: "",
                    supervisor: "",
                })
            } else {
                console.error("Work details submission failed:", data.error);
                alert("Work details submission failed");
            }
        } catch (error) {
            console.error("Error submitting work details:", error);
            alert("Error submitting work details");
        }
    };

    const handleAddSuperviser = () => {
        setIsSupervisersModalOpen(true);
    };

    const handleSelectSuperviser = (supervisorId) => {
        setWorkFormData({ ...workFormData, supervisor: supervisorId });
    };

    const handleModalClose = () => {
        setIsSupervisersModalOpen(false);
    };

    return (
        <div className="mt-10 bg-[#eaeaea] p-6 rounded-lg mx-10">
            <h2 className="text-2xl mb-4 text-gray-700">Work Details</h2>
            <form onSubmit={handleWorkSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4" >
                <div>
                    <label className="block mb-1 text-gray-500">Employee Id</label>
                    <input
                        required
                        name="empId"
                        value={workFormData.empId}
                        onChange={handleChange}
                        className="border-none rounded-md p-2 w-full"
                        placeholder="Enter your employee Id"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-gray-500">Work Email</label>
                    <input
                        required
                        name="workEmail"
                        value={workFormData.workEmail}
                        onChange={handleChange}
                        className="border-none rounded-md p-2 w-full"
                        placeholder="Enter Work Email"
                        type="email"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Work Phone</label>
                    <input
                        required
                        name="workPhone"
                        value={workFormData.workPhone}
                        onChange={handleChange}
                        className="border-none rounded-md p-2 w-full"
                        placeholder="Enter Work Phone"
                        type="tel"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Department</label>
                    <select
                        name="department"
                        value={workFormData.department}
                        onChange={handleChange}
                        className="border-none rounded-md p-2 w-full"
                    >
                        <option value="">Select Department</option>
                        <option value="IT">IT</option>
                        <option value="Marketing">Marketing</option>
                        <option value="HR">HR</option>
                        <option value="Financial">Financial</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Designation</label>
                    <input
                        required
                        name="designation"
                        value={workFormData.designation}
                        onChange={handleChange}
                        className="border-none rounded-md p-2 w-full"
                        placeholder="Enter designation"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Location</label>
                    <input
                        required
                        name="location"
                        value={workFormData.location}
                        onChange={handleChange}
                        className="border-none rounded-md p-2 w-full"
                        placeholder="Enter location"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Supervisor</label>
                    <div className='flex justify-between gap-2'>
                        <input
                            required
                            name="supervisor"
                            value={workFormData.supervisor}
                            onChange={handleChange}
                            className="border-none rounded-md p-2 w-full"
                            placeholder="Select a supervisor"
                            readOnly
                        />
                        <button
                            className='bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-full'
                            onClick={(event) => {
                                event.preventDefault();
                                handleAddSuperviser();
                            }}
                        >
                            <FaUserPlus size={20} />
                        </button>
                    </div>
                </div>

                <div className="col-span-2 flex justify-start mt-6">
                    <button
                        type="submit"
                        className="w-32 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px]"
                    >
                        Submit
                    </button>
                </div>
            </form>
            {isSupervisersModelOpen && <Supervisers onClose={handleModalClose} onSelect={handleSelectSuperviser} />}
        </div>
    )
}

export default AddWorkDetails