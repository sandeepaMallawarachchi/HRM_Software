import React, { useState } from 'react';

const PersonalDetails = () => {
    const [editable, setEditable] = useState(false);
    const [details, setDetails] = useState({
        name: 'Sandeepa Mallawarachchi',
        phone: '+94 712345678',
        address: '',
        maritalStatus: '',
    });

    const handleChange = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    return (
        <div className="mt-4">
            <h3 className="text-lg font-semibold">Personal Details</h3>
            {editable ? (
                <div>
                    <input name="name" value={details.name} onChange={handleChange} className="border" />
                    <input name="phone" value={details.phone} onChange={handleChange} className="border" />
                    <input name="address" value={details.address} onChange={handleChange} className="border" />
                    <input name="maritalStatus" value={details.maritalStatus} onChange={handleChange} className="border" />
                    <button onClick={() => setEditable(false)}>Save</button>
                </div>
            ) : (
                <div>
                    <p>Name: {details.name}</p>
                    <p>Phone: {details.phone}</p>
                    <p>Address: {details.address}</p>
                    <p>Marital Status: {details.maritalStatus}</p>
                    <button onClick={() => setEditable(true)}>Edit</button>
                </div>
            )}
        </div>
    );
};

export default PersonalDetails;
