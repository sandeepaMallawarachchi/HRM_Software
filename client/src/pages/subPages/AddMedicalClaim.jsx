import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaMoneyBillWave, FaChartLine, FaClipboardList, FaFileUpload, FaTimes } from "react-icons/fa";

const AddMedicalClaim = () => {
    const empId = localStorage.getItem('empId');
    const [files, setFiles] = useState([]);
    const [requestAmount, setRequestAmount] = useState("");
    const [claimSummary, setClaimSummary] = useState({});
    const [loading, setLoading] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    };

    const handleAmountChange = (e) => setRequestAmount(e.target.value);

    const handleRemoveFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const uploadClaims = async () => {
        if (!files.length || !requestAmount) return alert("All fields are required");

        if (!termsAccepted) {
            alert("Please accept the terms and conditions.");
            return;
        }

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("medicalClaim", file);
        });
        formData.append("requestamount", requestAmount);

        try {
            setLoading(true);
            await axios.post(`http://localhost:4000/medical/uploadMedicalClaim/${empId}`, formData);
            setFiles([]);
            setRequestAmount("");
            alert("Claims uploaded successfully");
        } catch (err) {
            alert("Error uploading claims");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTotal = async () => {
        try {
            const res = await axios.get(`http://localhost:4000/medical/getClaimSummary/${empId}`);
            setClaimSummary(res.data);
        } catch (err) {
            console.log("Error fetching claims");
        }
    };

    useEffect(() => {
        fetchTotal();
    }, [empId]);

    return (
        <div className="p-6 px-20 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Medical Claims</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

                <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                    <FaMoneyBillWave className="text-4xl text-green-500 mr-4" />
                    <div>
                        <h3 className="text-xl font-semibold">Maximum Amount</h3>
                        <p className="text-gray-700">
                            {claimSummary?.maxAmount || 0}LKR
                        </p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                    <FaChartLine className="text-4xl text-blue-500 mr-4" />
                    <div>
                        <h3 className="text-xl font-semibold">Spent Amount</h3>
                        <p className="text-gray-700">
                            {claimSummary?.totalSpent || 0}LKR
                        </p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                    <FaClipboardList className="text-4xl text-yellow-500 mr-4" />
                    <div>
                        <h3 className="text-xl font-semibold">Remaining Amount</h3>
                        <p className="text-gray-700">
                            {claimSummary?.maxAmount - claimSummary?.totalSpent}LKR
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 mb-4">
                <div>
                    <input
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                        className="hidden"
                        multiple
                    />
                    <label
                        htmlFor="file"
                        className="w-36 bg-gray-300 p-2 rounded-lg cursor-pointer flex items-center gap-2 hover:bg-gray-400"
                    >
                        <FaFileUpload />
                        <span>Upload File</span>
                    </label>
                </div>

                {/* Display selected files */}
                {files.length > 0 && (
                    <div className="mt-2">
                        <h4 className="text-lg font-semibold">Selected Files:</h4>
                        <ul className="list-disc pl-6">
                            {files.map((file, index) => (
                                <li key={index} className="flex items-center justify-between bg-gray-200 p-2 px-4 mb-2 rounded-lg">
                                    <span>{file.name}</span>
                                    <button
                                        onClick={() => handleRemoveFile(index)}
                                        className="text-red-500"
                                    >
                                        <FaTimes />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div>
                    <label className="block mb-1 text-gray-500">Request Amount</label>
                    <input
                        type="number"
                        placeholder="Enter Request Amount"
                        value={requestAmount}
                        onChange={handleAmountChange}
                        required
                        className="border rounded-md p-2 w-full"
                    />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={() => setTermsAccepted(!termsAccepted)}
                        required
                        className="mr-2"
                    />
                    <span className="text-gray-600">
                        I agree to the <a href="#" className="underline">terms and conditions</a>
                    </span>
                </div>

                <button
                    type="submit"
                    onClick={uploadClaims}
                    className="w-40 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-[20px] mt-4"
                >
                    {loading ? "Uploading..." : "Upload Claims"}
                </button>
            </div>
        </div>
    );
};

export default AddMedicalClaim;