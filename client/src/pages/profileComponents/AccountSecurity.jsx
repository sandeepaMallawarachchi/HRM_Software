import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AccountSecurity = () => {
    const [editable, setEditable] = useState(false);
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const empId = localStorage.getItem("empId");

    // Password validation logic
    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;
        return regex.test(password);
    };

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/employees/getEmployee/${empId}`);
                const data = response.data.email || {};

                setEmail(data);
            } catch (err) {
                console.log('Error fetching email:', err);
            }
        };
        fetchEmail();
    }, [empId]);

    const handleChange = (e) => {
        switch (e.target.name) {
            case 'resetCode':
                setResetCode(e.target.value);
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

    const handleSendResetCode = async () => {
        try {
            const res = await axios.post("http://localhost:4000/employees/requestPasswordReset", { email });
            if (res.status === 200) {
                setEditable(true);
                alert("Reset code sent successfully");
            }
        } catch (error) {
            setError("Failed to send reset code. Please try again.");
            console.log("Error sending reset code:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validatePassword(newPassword)) {
            setError("Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match!");
            return;
        }

        try {
            const res = await axios.post("http://localhost:4000/employees/resetPassword", {
                resetCode,
                newPassword,
            });

            if (res.status === 200) {
                setEditable(false);
                setNewPassword('');
                setConfirmPassword('');
                setResetCode('');
                alert("Password updated successfully");
            }
        } catch (error) {
            setError("Failed to reset password. Please try again.");
            console.log("Error resetting password:", error);
        }
    };

    return (
        <div className="mt-4 bg-[#eaeaea] p-6 rounded-lg">
            <h3 className="text-lg">Password Management</h3>
            {editable ? (
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    {error && <div className="text-red-600">{error}</div>}
                    <div>
                        <label className="block text-sm">Reset Code</label>
                        <input
                            type="text"
                            name="resetCode"
                            value={resetCode}
                            onChange={handleChange}
                            className="mt-1 block w-full border-none rounded-md p-2"
                            placeholder="Enter the reset code"
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
                            className="mt-1 block w-full border-none rounded-md p-2"
                            placeholder="Enter your new password"
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
                            className="mt-1 block w-full border-none rounded-md p-2"
                            placeholder="Confirm your new password"
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
                    <button onClick={handleSendResetCode} className="mt-5 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px]">
                        Send Reset Code
                    </button>
                </div>
            )}
        </div>
    );
};

export default AccountSecurity;