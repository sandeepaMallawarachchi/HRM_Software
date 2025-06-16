import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaLink } from "react-icons/fa";

const AcceptMedicalClaims = () => {
    const empId = localStorage.getItem("empId");
    const [claims, setClaims] = useState([]);
    const [filteredClaims, setFilteredClaims] = useState([]);
    const [yearFilter, setYearFilter] = useState("");
    const [monthFilter, setMonthFilter] = useState("");

    const fetchClaims = async () => {
        try {
            const res = await axios.get(`https://global-hrm-mobile-server.vercel.app/medical/getAllMedicalClaim`);
            setClaims(res.data);
            setFilteredClaims(res.data);
        } catch (err) {
            console.log("Error fetching claims");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-CA");
    };

    const handleFilterChange = () => {
        const filteredList = claims.filter((claim) => {
            const requestDate = new Date(claim.created_at);
            const requestYear = requestDate.getFullYear();
            const requestMonth = requestDate.getMonth() + 1;
            const matchesYear = yearFilter ? requestYear === parseInt(yearFilter) : true;
            const matchesMonth = monthFilter ? requestMonth === parseInt(monthFilter) : true;
            return matchesYear && matchesMonth;
        });
        setFilteredClaims(filteredList);
    };

    const updateClaimStatus = async (claimId, status) => {
        try {
            await axios.put(`https://global-hrm-mobile-server.vercel.app/medical/updateClaimStatus/${claimId}/${status}`);
            alert("Claim status updated successfully");
            await fetchClaims();
        } catch (err) {
            console.log("Error updating claim status");
        }
    };

    useEffect(() => {
        fetchClaims();
        handleFilterChange();
    }, [empId, yearFilter, monthFilter, claims]);

    return (
        <div className="p-6 px-20 bg-gray-100 rounded-lg shadow-md">
            <div className="flex space-x-4 mt-5">
                <div>
                    <label className="block text-gray-700">Filter by Year</label>
                    <select
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="border-none rounded-md p-2 w-full"
                    >
                        <option value="">All Years</option>
                        {[...new Set(claims.map(claim => new Date(claim.created_at).getFullYear()))]
                            .sort((a, b) => b - a)
                            .map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))
                        }
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700">Filter by Month</label>
                    <select
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(e.target.value)}
                        className="border-none rounded-md p-2 w-full"
                    >
                        <option value="">All Months</option>
                        {Array.from({ length: 12 }, (_, index) => (
                            <option key={index + 1} value={index + 1}>
                                {new Date(0, index).toLocaleString("en-US", { month: "long" })}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="mt-10">
                <table className="min-w-full bg-white border text-gray-600 rounded-lg">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Claim ID</th>
                            <th className="py-2 px-4 border-b">Employee ID</th>
                            <th className="py-2 px-4 border-b">Requested Date</th>
                            <th className="py-2 px-4 border-b">Request Amount</th>
                            <th className="py-2 px-4 border-b">File Link</th>
                            <th className="py-2 px-4 border-b">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClaims.length > 0 ? (
                            filteredClaims.map((claim, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b text-center">{claim.id}</td>
                                    <td className="py-2 px-4 border-b text-center">{claim.empId}</td>
                                    <td className="py-2 px-4 border-b text-center">{formatDate(claim.created_at)}</td>
                                    <td className="py-2 px-4 border-b text-center">{claim.requestamount}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        {claim.claim && claim.claim.length > 0 ? (
                                            claim.claim.map((link, linkIndex) => (
                                                <a
                                                    key={linkIndex}
                                                    href={link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex justify-center items-center text-orange-500 hover:text-orange-700 mx-1"
                                                >
                                                    <FaLink size={20} />
                                                </a>
                                            ))
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {claim.claimstatus === "Pending" ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => updateClaimStatus(claim.id, "Accepted")}
                                                    className="px-2 py-1 rounded text-white bg-blue-500 hover:bg-blue-600 w-full"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => updateClaimStatus(claim.id, "Rejected")}
                                                    className="px-2 py-1 rounded text-white bg-red-500 hover:bg-red-600 w-full"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-center font-medium">{claim.claimstatus}</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4">No medical claims found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AcceptMedicalClaims;