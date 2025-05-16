import React, { useState, useEffect } from "react";
import axios from "axios";
import LeaveRequest from "./subPages/LeaveRequest";
import LeaveAnalysis from "./subPages/LeaveAnalysis";
import MyLeaves from "./subPages/MyLeaves";
import CheckLeaves from "./subPages/CheckLeaves"; // Create this component

const LeaveAndAttendance = () => {
  const [visibleSection, setVisibleSection] = useState("leave");
  const [isSupervisor, setIsSupervisor] = useState(false);
  const role = localStorage.getItem("role");
  const empId = localStorage.getItem("empId");

  const handleSectionToggle = (section) => {
    setVisibleSection(visibleSection === section ? null : section);
  };

  useEffect(() => {
    const fetchAssignedEmployees = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/admin/getAssignedEmployees/${empId}`
        );
        setIsSupervisor(res.data && res.data.length > 0);
      } catch (error) {
        console.log(error);
        setIsSupervisor(false);
      }
    };

    fetchAssignedEmployees();
  }, [empId]);

  return (
    <div className="md:col-span-2 space-y-4 m-10">
      <div className="flex space-x-6 mt-4">
        <button
          onClick={() => handleSectionToggle("leave")}
          className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${
            visibleSection === "leave" ? "bg-orange-500 text-white" : ""
          }`}
        >
          Leave Request
        </button>
        <button
          onClick={() => handleSectionToggle("myleaves")}
          className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${
            visibleSection === "myleaves" ? "bg-orange-500 text-white" : ""
          }`}
        >
          My Leaves
        </button>
        <button
          onClick={() => handleSectionToggle("attendance")}
          className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${
            visibleSection === "attendance" ? "bg-orange-500 text-white" : ""
          }`}
        >
          Leave Analysis
        </button>
        {role === "HR" && (
          <button
            onClick={() => handleSectionToggle("checkleaves")}
            className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${
              visibleSection === "checkleaves" ? "bg-orange-500 text-white" : ""
            }`}
          >
            Check Leaves
          </button>
        )}
      </div>

      {visibleSection === "leave" && <LeaveRequest />}
      {visibleSection === "myleaves" && <MyLeaves />}
      {visibleSection === "attendance" && <LeaveAnalysis />}
      {visibleSection === "checkleaves" && <CheckLeaves />}
    </div>
  );
};

export default LeaveAndAttendance;
