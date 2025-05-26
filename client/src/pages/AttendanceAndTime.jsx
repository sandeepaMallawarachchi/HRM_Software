import React, { useState } from "react";
import PunchInOut from "./subPages/PunchInOut";
import MyAttendance from "./subPages/MyAttendance";
import AttendanceAnalysis from "./subPages/AttendanceAnalysis";
import AllEmployeeAttendance from "./subPages/AllEmployeeAttendance";

const AttendanceAndTime = () => {
  const [visibleSection, setVisibleSection] = useState("punchinout");
  const role = localStorage.getItem("role");
  const handleSectionToggle = (section) => {
    setVisibleSection(visibleSection === section ? null : section);
  };

  return (
    <div className="md:col-span-2 space-y-4 m-10">
      <div className="flex space-x-6 mt-4">
        <button
          onClick={() => handleSectionToggle("punchinout")}
          className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${
            visibleSection === "punchinout" ? "bg-orange-500 text-white" : ""
          }`}
        >
          Punch In / Punch Out
        </button>
        <button
          onClick={() => handleSectionToggle("attendance")}
          className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${
            visibleSection === "attendance" ? "bg-orange-500 text-white" : ""
          }`}
        >
          My Attendance Records
        </button>
        <button
          onClick={() => handleSectionToggle("analysis")}
          className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${
            visibleSection === "analysis" ? "bg-orange-500 text-white" : ""
          }`}
        >
          Attendance Analysis
        </button>
        {role === "HR" && (
          <button
            onClick={() => handleSectionToggle("allemployeeattendance")}
            className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${
              visibleSection === "allemployeeattendance"
                ? "bg-orange-500 text-white"
                : ""
            }`}
          >
            All Employee Attendance
          </button>
        )}
      </div>

      {visibleSection === "punchinout" && <PunchInOut />}
      {visibleSection === "attendance" && <MyAttendance />}
      {visibleSection === "analysis" && <AttendanceAnalysis />}
      {visibleSection === "allemployeeattendance" && <AllEmployeeAttendance />}
    </div>
  );
};

export default AttendanceAndTime;
