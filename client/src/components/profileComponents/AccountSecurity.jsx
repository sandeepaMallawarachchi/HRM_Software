import React, { useState } from 'react';

const AccountSecurity = () => {
    const [editable, setEditable] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChange = (e) => {
        switch (e.target.name) {
            case 'currentPassword':
                setCurrentPassword(e.target.value);
                break;
            case 'newPassword':
                setNewPassword(e.target.value);
                break;
            case 'confirmPassword':
                setConfirmPassword(e.target.value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword === confirmPassword) {
            console.log("Password updated");
            // Add logic to update password here
            setEditable(false);
            // Reset inputs
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            alert("New passwords do not match!");
        }
    };

    return (
        <div className="mt-4 bg-[#eaeaea] p-6 rounded-lg">
            <h3 className="text-lg">Password Management</h3>
            {editable ? (
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm">Current Password</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={currentPassword}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded-md p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={newPassword}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded-md p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded-md p-2"
                            required
                        />
                    </div>
                    <div className="flex justify-start space-x-2 mt-4">
                        <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px]">
                            Submit
                        </button>
                        <button type="button" onClick={() => setEditable(false)} className="text-gray-500 hover:underline">
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div>
                    <button onClick={() => setEditable(true)} className="mt-2 text-blue-600 hover:underline">
                        Change Password
                    </button>
                </div>
            )}
        </div>
    );
};

export default AccountSecurity;