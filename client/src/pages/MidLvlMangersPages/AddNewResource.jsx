import axios from "axios";
import React, { useState } from "react";

const AddNewResource = ({ onClose }) => {
    const [resourceData, setResourceData] = useState({
        resource: '',
        type: '',
        quantity: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setResourceData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newResource = {
            resource: resourceData.resource,
            type: resourceData.type,
            quantity: resourceData.quantity,
        };

        try {
            await axios.post(`http://localhost:4000/admin/addNewResource`, newResource);
            setResourceData({
                resource: '',
                type: '',
                quantity: '',
            });
            alert('New resource added successfully!');
        } catch (error) {
            console.error('Error adding resource:', error);
            alert('Failed to add resource.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-8 w-2/3 shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Add New Resource</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="resource" className="block text-sm font-semibold text-gray-700 mb-2">
                            Resource
                        </label>
                        <input
                            id="resource"
                            type="text"
                            placeholder="Enter resource name"
                            value={resourceData.resource}
                            onChange={handleChange}
                            name="resource"
                            className="border border-gray-300 rounded-lg p-3 mb-3 w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                            Resource Type
                        </label>
                        <input
                            id="type"
                            placeholder="Enter type of resource"
                            value={resourceData.type}
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
                            value={resourceData.quantity}
                            onChange={handleChange}
                            name="quantity"
                            placeholder="Enter quantity of resource"
                            className="border border-gray-300 rounded-lg p-3 mb-3 w-full"
                        />
                    </div>
                    <div className="flex justify-start mt-4 space-x-4">
                        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg">
                            Save
                        </button>
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 hover:underline">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNewResource;