import React, { useState } from "react";

// Sample job postings data (in a real application, this would be fetched from an API)
const sampleJobPostings = [
  {
    id: 1,
    title: "Software Engineer",
    department: "IT",
    description: "Develop and maintain software applications.",
    status: "Open",
  },
  {
    id: 2,
    title: "Sales Manager",
    department: "Sales",
    description: "Lead the sales team and manage client relationships.",
    status: "Open",
  },
  {
    id: 3,
    title: "HR Executive",
    department: "HR",
    description: "Assist in recruitment and employee management.",
    status: "Closed",
  },
];

const RecruitmentManagement = () => {
  const [jobPostings, setJobPostings] = useState(sampleJobPostings);
  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    description: "",
    status: "Open",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prevJob) => ({
      ...prevJob,
      [name]: value,
    }));
  };

  const handleAddJobPosting = () => {
    setJobPostings((prevPostings) => [
      ...prevPostings,
      { ...newJob, id: prevPostings.length + 1 },
    ]);
    setNewJob({ title: "", department: "", description: "", status: "Open" });
  };

  const filteredJobPostings = jobPostings.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Recruitment Management</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search job postings..."
          className="border rounded p-2 mb-4 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h2 className="text-xl font-semibold mb-2">Current Job Postings</h2>
      <table className="min-w-full border-collapse border border-gray-200 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 px-4 py-2">Title</th>
            <th className="border border-gray-200 px-4 py-2">Department</th>
            <th className="border border-gray-200 px-4 py-2">Description</th>
            <th className="border border-gray-200 px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobPostings.map((job) => (
            <tr key={job.id} className="hover:bg-gray-50">
              <td className="border border-gray-200 px-4 py-2">{job.title}</td>
              <td className="border border-gray-200 px-4 py-2">
                {job.department}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                {job.description}
              </td>
              <td className="border border-gray-200 px-4 py-2">{job.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-semibold mb-2">Add New Job Posting</h2>
      <div className="mb-4">
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          className="border rounded p-2 mb-2 w-full"
          value={newJob.title}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          className="border rounded p-2 mb-2 w-full"
          value={newJob.department}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Job Description"
          className="border rounded p-2 mb-2 w-full"
          value={newJob.description}
          onChange={handleInputChange}
        />
        <select
          name="status"
          className="border rounded p-2 mb-2 w-full"
          value={newJob.status}
          onChange={handleInputChange}
        >
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
        <button
          onClick={handleAddJobPosting}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Job Posting
        </button>
      </div>
    </div>
  );
};

export default RecruitmentManagement;
