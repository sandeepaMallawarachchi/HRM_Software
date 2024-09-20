import React, { useState } from 'react';

const PersonalDetails = () => {
    const [details, setDetails] = useState({
        name: 'Sandeepa Mallawarachchi',
        email: 'sandeepa@gmail.com',
        phone: '+94 712345678',
        address: 'Gampaha',
        country: 'Sri Lanka',
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
                    <label className="block mb-1 text-gray-500">Name</label>
                    <input
                        name="name"
                        value={details.name}
                        readOnly
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter your name"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Personal Email</label>
                    <input
                        name="email"
                        value={details.email}
                        onChange={handleChange}
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter your Email"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Personal Phone</label>
                    <input
                        name="phone"
                        value={details.phone}
                        onChange={handleChange}
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter your phone"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Emergency Contact</label>
                    <input
                        name="phone"
                        value={details.phone}
                        onChange={handleChange}
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter your phone"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Personal Address</label>
                    <input
                        name="address"
                        value={details.address}
                        onChange={handleChange}
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter your address"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Date Of Birth</label>
                    <input
                        name="dateOfBirth"
                        type='date'
                        onChange={handleChange}
                        className="border-none rounded-md p-2 w-full"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Gender</label>
                    <select
                        name="gender"
                        // value={details.gender || ''} // Use gender in the state
                        onChange={handleChange}
                        className="border-none rounded-md p-2 w-full"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Country</label>
                    <input
                        name="country"
                        type='text'
                        value={details.country}
                        onChange={handleChange}
                        placeholder="Enter your country"
                        className="border-none rounded-md p-2 w-full"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Marital Status</label>
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
                    <label className="block mb-1 text-gray-500">Number of Dependents</label>
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
                        className="w-32 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px] mt-4"
                    >
                        Save
                    </button>
                )}
            </div>
        </div>
    );
};

export default PersonalDetails;