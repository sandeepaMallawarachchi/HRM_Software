import axios from "axios";
import React, { useState } from "react";

const AddNewResource = ({ onClose }) => {
    const empId = localStorage.getItem('empId');
    const [resourseData, setResourseData] = useState({
        resourse: '',
        type: '',
        quantity: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setResourseData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newResourse = {
            empId,
            resourse: resourseData.resourse,
            type: resourseData.type,
            quantity: resourseData.quantity,
        };

        try {
            await axios.post(`http://localhost:4000/admin/addNewResourse/${empId}`, newResourse);
            setResourseData({
                resourse: '',
                type: '',
                quantity: '',
            });
            alert('New resourse added successfully!');
        } catch (error) {
            console.error('Error adding resourse:', error);
            alert('Failed to add resourse.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-8 w-2/3 shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Add New Resourse</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="Resourse" className="block text-sm font-semibold text-gray-700 mb-2">
                            Resourse
                        </label>
                        <input
                            id="Resourse"
                            type="text"
                            placeholder="Enter resourse name"
                            value={resourseData.resourse}
                            onChange={handleChange}
                            name="Resourse"
                            className="border border-gray-300 rounded-lg p-3 mb-3 w-full"
                        />
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                            Resourse Type
                        </label>
                        <input
                            id="type"
                            placeholder="Enter type of resousre"
                            value={resourseData.type}
                            onChange={handleChange}
                            name="type"
                            className="border border-gray-300 rounded-lg p-3 mb-3 w-full"
                        />
                    </div>

                    <div>
                        <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-2">
                            Quantity
                        </label>
                        <input
                            id="quantity"
                            type="number"
                            value={resourseData.quantity}
                            onChange={handleChange}
                            name="quantity"
                            placeholder="Enter quantity of resourse"
                            className="border border-gray-300 rounded-lg p-3 mb-3 w-full"
                        />
                    </div>
                    <div className="flex justify-start mt-4 space-x-4">
                        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg">
                            Save
                        </button>
                        <button onClick={onClose} className="px-4 py-2 text-gray-500 hover:underline">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNewResource;
