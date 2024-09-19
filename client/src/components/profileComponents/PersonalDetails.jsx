import React, { useState } from 'react';

const PersonalDetails = () => {
    const [editable, setEditable] = useState(false);
    const [details, setDetails] = useState({
        name: 'Sandeepa Mallawarachchi',
        phone: '+94 712345678',
        address: 'Gampaha',
        maritalStatus: 'Singal',
    });

    const handleChange = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    return (
        <div className="mt-4 bg-[#f6f5fb] p-6 rounded-lg">
            {editable ? (
                <div className="space-y-4">
                    <input
                        name="name"
                        value={details.name}
                        onChange={handleChange}
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter your name"
                    />
                    <input
                        name="phone"
                        value={details.phone}
                        onChange={handleChange}
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter your phone"
                    />
                    <input
                        name="address"
                        value={details.address}
                        onChange={handleChange}
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter your address"
                    />
                    <input
                        name="maritalStatus"
                        value={details.maritalStatus}
                        onChange={handleChange}
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter marital status"
                    />
                    <div className="flex space-x-2 mt-4">
                        <button onClick={() => setEditable(false)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px]">
                            Save
                        </button>
                        <button onClick={() => setEditable(false)} className="text-gray-500 hover:underline">
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <p>Name: {details.name}</p>
                    <p>Phone: {details.phone}</p>
                    <p>Address: {details.address}</p>
                    <p>Marital Status: {details.maritalStatus}</p>
                    <button onClick={() => setEditable(true)} className="mt-2 text-blue-600 hover:underline">
                        Edit
                    </button>
                </div>
            )}
        </div>
    );
};

export default PersonalDetails;