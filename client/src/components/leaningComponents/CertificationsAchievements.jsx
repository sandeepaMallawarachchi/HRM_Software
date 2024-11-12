import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../CSS/LearningDevelopment.css";

const CertificationsAchievements = () => {
    const empId = localStorage.getItem('empId');
    const [certificateData, setCertificateData] = useState({
        certificate_name: '',
        link: '',
        status: '',
    });
    const [certificatesList, setCertificatesList] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCertificateData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newCertificate = {
            empId,
            certificate_name: certificateData.certificate_name,
            link: certificateData.link,
            status: certificateData.status,
        };

        try {
            await axios.post(`http://localhost:4000/employees/addCertificate/${empId}`, newCertificate);
            alert('Certificate added successfully!');
            setCertificateData({
                certificate_name: '',
                link: '',
                status: '',
            });
        } catch (error) {
            alert('Failed to add certificate.');
        }
    };

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/employees/getCertificates/${empId}`);
                setCertificatesList(response.data);
            } catch (error) {
                console.error('Error fetching certificates:', error);
            }
        };
        fetchCertificates();
    }, [empId]);

    return (
        <div className="card bg-gradient-to-r from-orange-400 to-orange-300 text-white rounded-lg p-5 transition-shadow duration-300 hover:shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Certifications and Achievements</h2>
            <ul className="list-disc list-inside ml-5 mb-4">
                {certificatesList.map((certificate) => (
                    <li key={certificate.id}>
                        <a href={certificate.link} target="_blank" rel="noopener noreferrer" className="underline mr-2">
                            {certificate.certificate_name}
                        </a>
                        - {certificate.status}
                    </li>
                ))}
            </ul>

            <div className="mt-4">
                <h3 className="text-md font-semibold mb-2">Add New Certification</h3>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <input
                        type="text"
                        name="certificate_name"
                        value={certificateData.certificate_name}
                        onChange={handleChange}
                        placeholder="Certification Name"
                        className="p-2 mb-2 rounded bg-white text-gray-800"
                    />
                    <input
                        type="text"
                        name="link"
                        value={certificateData.link}
                        onChange={handleChange}
                        placeholder="Certification Link"
                        className="p-2 mb-2 rounded bg-white text-gray-800"
                    />
                    <select
                        name="status"
                        value={certificateData.status}
                        onChange={handleChange}
                        className="p-2 mb-2 rounded bg-white text-gray-800"
                    >
                        <option value="">Select Status</option>
                        <option value="Completed">Completed</option>
                        <option value="In Progress">In Progress</option>
                    </select>
                    <button
                        type="submit"
                        className="bg-white text-blue-500 rounded py-2 hover:bg-gray-200 transition duration-300"
                    >
                        Add Certification
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CertificationsAchievements;