import React, { useState, useEffect } from "react";
import axios from "axios";

const AddMedicalClaim = () => {
    const empId = localStorage.getItem('empId');
    const [files, setFiles] = useState([]);
    const [requestAmount, setRequestAmount] = useState("");
    const [claims, setClaims] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => setFiles(e.target.files);
    const handleAmountChange = (e) => setRequestAmount(e.target.value);

    const uploadClaims = async () => {
        if (!files.length || !requestAmount) return setError("All fields are required");

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("medicalClaim", files[i]);
        }
        formData.append("requestamount", requestAmount);

        try {
            setLoading(true);
            await axios.post(`http://localhost:4000/medical/uploadMedicalClaim/${empId}`, formData);
            fetchClaims();
            setFiles([]);
            setRequestAmount("");
        } catch (err) {
            setError("Error uploading claims");
        } finally {
            setLoading(false);
        }
    };

    const fetchClaims = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:4000/medical/getMedicalClaim/${empId}`);
            setClaims(res.data);
        } catch (err) {
            setError("Error fetching claims");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClaims();
    }, [empId]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Medical Claims</h2>
            <div className="flex flex-col gap-4 mb-4">
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="block w-full text-gray-700 border rounded-lg p-2"
                />
                <input
                    type="number"
                    placeholder="Request Amount"
                    value={requestAmount}
                    onChange={handleAmountChange}
                    className="block w-full border rounded-lg p-2"
                />
                <button
                    onClick={uploadClaims}
                    className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg"
                    disabled={loading}
                >
                    {loading ? "Uploading..." : "Upload Claims"}
                </button>
                {error && <p className="text-red-500">{error}</p>}
            </div>
            <table className="min-w-full bg-white border rounded-lg">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 border">Claim ID</th>
                        <th className="px-4 py-2 border">Request Amount</th>
                        <th className="px-4 py-2 border">File Link</th>
                    </tr>
                </thead>
                <tbody>
                    {claims.map((claim) => (
                        <tr key={claim.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border text-center">{claim.id}</td>
                            <td className="px-4 py-2 border text-center">{claim.requestamount}</td>
                            <td className="px-4 py-2 border text-center">
                                <a
                                    href={claim.claim}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    View File
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AddMedicalClaim;
