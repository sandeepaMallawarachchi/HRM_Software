import React, { useState } from "react";
import axios from "axios";

export default function ForgotPasswordModal({ isOpen, onClose }) {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [resetCode, setResetCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Validate password
    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;
        return regex.test(password);
    };

    // Send reset code request
    const handleNextStep = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (step === 1) {
            try {
                const res = await axios.post("http://localhost:4000/employees/requestPasswordReset", { email });

                if (res.status === 200) {
                    setStep(2); // Proceed to the next step
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setError("Email not found. Please enter a valid email.");
                } else {
                    setError("Failed to send reset code. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        }
    };

    // Submit new password after receiving reset code
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validatePassword(newPassword)) {
            setError("Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:4000/employees/resetPassword", {
                resetCode,
                newPassword,
            });

            if (res.status === 200) {
                onClose(); // Close the modal after successful reset
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError("Invalid reset code. Please try again.");
            } else if (error.response && error.response.status === 400) {
                setError("Reset code has expired. Please request a new one.");
            } else {
                setError("Failed to reset password. Please try again.");
            }
        }
    };

    return (
        isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg p-6 w-1/3 shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-center">
                        {step === 1 ? "Forgot Password" : "Reset Password"}
                    </h2>
                    {error && <div className="text-red-600 mb-3">{error}</div>}

                    {step === 1 && (
                        <form onSubmit={handleNextStep}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    type="submit"
                                    className="bg-orange-500 text-white px-4 py-2 rounded-[20px]"
                                    disabled={loading}
                                >
                                    {loading ? "Sending Reset Code..." : "Next"}
                                </button>
                                <button
                                    type="button"
                                    className="text-gray-500 hover:underline"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Reset Code</label>
                                <input
                                    type="text"
                                    value={resetCode}
                                    onChange={(e) => setResetCode(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="Enter the reset code"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="Enter your new password"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="Confirm your new password"
                                    required
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    type="submit"
                                    className="bg-orange-500 text-white px-4 py-2 rounded-[20px]"
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    className="text-gray-500 hover:underline"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        )
    );
}