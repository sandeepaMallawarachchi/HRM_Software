import React, { useState } from 'react';

const EmployeeRegistration = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        country: '',
        gender: '',
        maritalStatus: 'Single',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <div className="mt-10 bg-[#eaeaea] p-6 rounded-lg mx-10">
            <h2 className="text-2xl mb-4 text-gray-700">Register</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 text-gray-500">Username</label>
                    <input
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="border-none rounded-md p-2 w-full"
                        placeholder="Enter your username"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Email</label>
                    <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border-none rounded-md p-2 w-full"
                        placeholder="Enter your email"
                        type="email"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Password</label>
                    <input
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="border-none rounded-md p-2 w-full"
                        placeholder="Enter your password"
                        type="password"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Confirm Password</label>
                    <input
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="border-none rounded-md p-2 w-full"
                        placeholder="Confirm your password"
                        type="password"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Phone Number</label>
                    <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="border-none rounded-md p-2 w-full"
                        placeholder="Enter your phone number"
                        type="tel"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Address</label>
                    <input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="border-none rounded-md p-2 w-full"
                        placeholder="Enter your address"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Country</label>
                    <input
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="border-none rounded-md p-2 w-full"
                        placeholder="Enter your country"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Gender</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="border-none-none rounded-md p-2 w-full"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1 text-gray-500">Marital Status</label>
                    <select
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                        className="border-none-none rounded-md p-2 w-full"
                    >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Widower">Widower</option>
                        <option value="Divorced">Divorced</option>
                    </select>
                </div>

                <div className="col-span-2 flex justify-center mt-6">
                    <button
                        type="submit"
                        className="w-32 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px]"
                    >
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmployeeRegistration;
