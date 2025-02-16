import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/LearningDevelopment.css";
import AllCertificatesAndTrainings from "./AllCerificatesAndTrainings";

const CertificationsAchievements = () => {
  const empId = localStorage.getItem("empId");
  const [certificateData, setCertificateData] = useState({
    certificate_name: "",
    link: "",
    status: "",
  });
  const [certificatesList, setCertificatesList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      await axios.post(
        `http://localhost:4000/employees/addCertificate/${empId}`,
        newCertificate
      );
      alert("Certificate added successfully!");
      setCertificateData({
        certificate_name: "",
        link: "",
        status: "",
      });
    } catch (error) {
      alert("Failed to add certificate.");
    }
  };

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/employees/getCertificates/${empId}`
        );
        setCertificatesList(response.data);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      }
    };
    fetchCertificates();
  }, [empId]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="card bg-gradient-to-r text-black rounded-lg p-5 transition-shadow duration-300 hover:shadow-lg">
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold mb-2">Certifications</h2>
        <button
          onClick={openModal}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300"
        >
          View All
        </button>
      </div>

      {/* Ongoing Certifications */}
      <h3 className="font-semibold my-2">Ongoing Certifications</h3>
      <ul className="list-disc list-inside ml-5 mb-4 bg-orange-100 p-2 rounded">
        {certificatesList.filter((certificate) => certificate.status !== "Completed").length > 0 ? (
          certificatesList
            .filter((certificate) => certificate.status !== "Completed")
            .slice(0, 3)
            .map((certificate) => (
              <li key={certificate.id}>
                <a
                  href={certificate.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline mr-2 text-blue-500"
                >
                  {certificate.certificate_name}
                </a>
              </li>
            ))
        ) : (
          <span className="text-gray-600">
            - No ongoing certifications -
          </span>
        )}
      </ul>

      {/* Completed Certifications */}
      <h3 className="font-semibold mb-2">Completed Certifications</h3>
      <ul className="list-disc list-inside ml-5 mb-4 bg-green-100 p-2 rounded">
        {certificatesList.filter((certificate) => certificate.status === "Completed").length > 0 ? (
          certificatesList
            .filter((certificate) => certificate.status === "Completed")
            .slice(0, 3)
            .map((certificate) => (
              <li key={certificate.id}>
                <a
                  href={certificate.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline mr-2 text-blue-500"
                >
                  {certificate.certificate_name}
                </a>
              </li>
            ))
        ) : (
          <span className="text-gray-600">
            - No completed certifications -
          </span>
        )}
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
            required
            className="p-2 mb-2 rounded bg-white text-gray-800"
          />
          <input
            type="text"
            name="link"
            value={certificateData.link}
            onChange={handleChange}
            placeholder="Certification Link"
            required
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
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition duration-300"
          >
            Add Certification
          </button>
        </form>
      </div>

      {/* Modal */}
      <AllCertificatesAndTrainings
        isOpen={isModalOpen}
        onClose={closeModal}
        certificates={certificatesList}
      />
    </div>
  );
};

export default CertificationsAchievements;