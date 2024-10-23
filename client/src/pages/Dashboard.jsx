import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaCalendarPlus,
  FaClipboardList,
} from "react-icons/fa";
import AttandanceAnalysisComponent from "../components/subComponents/AttandanceAnalysisComponent";
import { Link } from "react-router-dom";
import ProfilePicture from "../components/subComponents/ProfilePicture";
import "../components/CSS/Dasboardcss.css";
import Actions from "../components/subComponents/Actions";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const empId = localStorage.getItem("empId");
  const [punchInTime, setPunchInTime] = useState(null);
  const [punchOutTime, setPunchOutTime] = useState(null);
  const [punchedStatus, setPunchedStatus] = useState("Not Punched Yet");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/employees/getCurrentDateAttendance/${empId}`
        );

        if (response.data.punch_in_time) {
          setPunchInTime(response.data.punch_in_time);
          setPunchedStatus("Punched In");
        }

        if (response.data.punch_out_time) {
          setPunchOutTime(response.data.punch_out_time);
          setPunchedStatus("Punched Out");
        }
      } catch (error) {
        console.error("Error fetching today's attendance:", error);
      }
    };

    fetchAttendance();
  }, [empId]);

  const pieData = {
    labels: ["HR", "Engineering", "Marketing", "Finance"],
    datasets: [
      {
        label: "Employees by Department",
        data: [12, 19, 8, 5],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const pieOptions = {
    maintainAspectRatio: false,
  };

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      <Link to="/attendance">
        <div className="cards col-span-1 bg-white rounded-lg  p-4">
          <h2 className="text-lg font-semibold mb-4">Time at Work</h2>
          <div className="flex items-center space-x-3 mb-5">
            <div className="bg-gray-300 rounded-full w-12">
              <ProfilePicture />
            </div>
            <div className="flex-1">
              <p className="text-orange-600 font-semibold">{punchedStatus}</p>
              <p className="text-sm">{punchInTime || "Not Punched In Yet"}</p>
              <p className="text-sm">{punchOutTime || "Not Punched Out Yet"}</p>
            </div>
          </div>
          <AttandanceAnalysisComponent />
        </div>
      </Link>

      <div className="col-span-1 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">My Actions</h2>
        <div className="text-center">
          <Actions />
        </div>
      </div>

      <div className=" cards col-span-1 bg-white rounded-lg  p-4">
        <h2 className="text-lg font-semibold mb-4">Quick Launch</h2>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-full hover:bg-orange-400 cursor-pointer group">
            <FaSignInAlt className="text-4xl text-gray-700 group-hover:text-white" />
            <p className="mt-2 text-gray-700 group-hover:text-white">
              Punch In
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-full hover:bg-orange-400 cursor-pointer group">
            <FaSignOutAlt className="text-4xl text-gray-700 group-hover:text-white" />
            <p className="mt-2 text-gray-700 group-hover:text-white">
              Punch Out
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-full hover:bg-orange-400 cursor-pointer group">
            <FaCalendarPlus className="text-4xl text-gray-700 group-hover:text-white" />
            <p className="mt-2 text-gray-700 group-hover:text-white">
              Request Leave
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-full hover:bg-orange-400 cursor-pointer group">
            <FaClipboardList className="text-4xl text-gray-700 group-hover:text-white" />
            <p className="mt-2 text-gray-700 group-hover:text-white">
              My Leaves
            </p>
          </div>
        </div>
      </div>

      <div className="cards col-span-1 bg-white rounded-lg  p-4">
        <h2 className="text-lg font-semibold mb-4">Buzz Latest Posts</h2>
        <div className="text-center">
          <p className="text-gray-500">No posts available</p>
        </div>
      </div>

      <div className="cards col-span-1 bg-white rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Employees on Leave Today</h2>
        <div className="text-center">
          <p className="text-gray-500">No employees on leave</p>
        </div>
      </div>

      <div className="cards col-span-1 bg-white rounded-lg  p-4">
        <h2 className="text-lg font-semibold mb-4">
          Employee Distribution by Sub Unit
        </h2>
        <div className="relative w-full h-64">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
