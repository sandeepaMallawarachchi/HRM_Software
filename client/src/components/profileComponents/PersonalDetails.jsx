import axios from 'axios';
import React, { useEffect, useState } from 'react';

const PersonalDetails = () => {
    const [details, setDetails] = useState({
        name: '',
        email: '',
        phone: '',
        emergency_contact: '',
        address: '',
        date_of_birth: '',
        gender: '',
        country: '',
        marital_status: '',
        dependents: 0
    });
    const [isChanged, setIsChanged] = useState(false);
    const id = 1;

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/employees/getPersonalDetails/${id}`);
                const data = response.data || {};

                // Manually format the date without time zone adjustments
                if (data.date_of_birth) {
                    const date = new Date(data.date_of_birth);
                    const year = date.getFullYear();
                    const month = (`0${date.getMonth() + 1}`).slice(-2);
                    const day = (`0${date.getDate()}`).slice(-2);
                    data.date_of_birth = `${year}-${month}-${day}`;
                }

                setDetails(data);
            } catch (err) {
                console.log('Error fetching personal details:', err);
            }
        };
        fetchDetails();
    }, [id]);

    const handleChange = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
        setIsChanged(true);
    };

    const handleSave = async () => {
        try {
            const response = await axios.post(`http://localhost:4000/employees/savePersonalDetails/${id}`, details);
            console.log(response.data.message);
            alert('Details updated successfully');
            setIsChanged(false);
        } catch (err) {
            console.log('Error saving personal details:', err);
            alert('Error updating personal details');
        }
    };

    return (
        <div className="mt-4 bg-[#eaeaea] p-6 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Form Fields */}
                <div>
                    <label className="block mb-1 text-gray-500">Name</label>
                    <input
                        name="name"
                        value={details.name || ''}
                        onChange={handleChange}
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter your name"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Personal Email</label>
                    <input
                        name="email"
                        value={details.email || ''}
                        onChange={handleChange}
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter your Email"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Personal Phone</label>
                    <input
                        name="phone"
                        value={details.phone || ''}
                        onChange={handleChange}
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter your phone"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Emergency Contact</label>
                    <input
                        name="emergency_contact"
                        value={details.emergency_contact || ''}
                        onChange={handleChange}
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter emergency contact"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Personal Address</label>
                    <input
                        name="address"
                        value={details.address || ''}
                        onChange={handleChange}
                        className="border rounded-md p-2 w-full"
                        placeholder="Enter your address"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Date Of Birth</label>
                    <input
                        name="date_of_birth"
                        type="date"
                        value={details.date_of_birth || ''}
                        onChange={handleChange}
                        className="border-none rounded-md p-2 w-full"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Gender</label>
                    <select
                        name="gender"
                        value={details.gender || ''}
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
                        type="text"
                        value={details.country || ''}
                        onChange={handleChange}
                        placeholder="Enter your country"
                        className="border-none rounded-md p-2 w-full"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Marital Status</label>
                    <select
                        name="marital_status"
                        value={details.marital_status || ''}
                        onChange={handleChange}
                        className="border-none rounded-md p-2 w-full"
                    >
                        <option value="">Select Marital Status</option>
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
                        value={details.dependents || ''}
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
