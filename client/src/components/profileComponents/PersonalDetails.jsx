import React, { useState } from 'react';

const PersonalDetails = () => {
    const [details, setDetails] = useState({
        name: 'Sandeepa Mallawarachchi',
        phone: '+94 712345678',
        address: 'Gampaha',
        maritalStatus: 'Single',
        dependents: 0, // New field for number of dependents
    });

    const [isChanged, setIsChanged] = useState(false);

    const handleChange = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
        setIsChanged(true);
    };

    const handleSave = () => {
        // Save logic here (e.g., send updated details to server or API)
        console.log('Saved details:', details);
        setIsChanged(false); 
    };

    return (
        <div className="mt-4 bg-[#eaeaea] p-6 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1">Name</label>
                    <input
                        name="name"
                        value={details.name}
                        onChange={handleChange}
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter your name"
                    />
                </div>

                <div>
                    <label className="block mb-1">Phone</label>
                    <input
                        name="phone"
                        value={details.phone}
                        onChange={handleChange}
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter your phone"
                    />
                </div>

                <div>
                    <label className="block mb-1">Address</label>
                    <input
                        name="address"
                        value={details.address}
                        onChange={handleChange}
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter your address"
                    />
                </div>

                <div>
                    <label className="block mb-1">Marital Status</label>
                    <select
                        name="maritalStatus"
                        value={details.maritalStatus}
                        onChange={handleChange}
                        className="border-none  rounded-md p-2 w-full"
                    >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Widower">Widower</option>
                        <option value="Divorced">Divorced</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1">Number of Dependents</label>
                    <input
                        type="number"
                        name="dependents"
                        value={details.dependents}
                        onChange={handleChange}
                        className="border-none rounded-md p-2 w-full"
                        placeholder="Enter number of dependents"
                    />
                </div>

                {isChanged && (
                    <button
                        onClick={handleSave}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px] mt-4"
                    >
                        Save
                    </button>
                )}
            </div>
        </div>
    );
};

export default PersonalDetails;