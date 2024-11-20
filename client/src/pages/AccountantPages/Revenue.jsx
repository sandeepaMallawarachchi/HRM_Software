import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Revenue = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [revenueData, setRevenueData] = useState({
    monthlyRevenue: [],
    totalRevenue: [],
  });

  // Fetch department list and revenue data
  useEffect(() => {
    // Fetch departments and revenue data
    const fetchData = async () => {
      try {
        // Assuming a route exists to fetch the departments
        const deptRes = await axios.get("/api/departments");
        setDepartments(deptRes.data); // Assume it returns an array of department names or IDs
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      const fetchRevenue = async () => {
        try {
          const res = await axios.get(
            `/api/getRevenue?department=${selectedDepartment}`
          );
          const { monthlyRevenue, revenueSources, totalRevenue } = res.data;
          setRevenueData({
            monthlyRevenue,
            totalRevenue: totalRevenue,
          });
        } catch (error) {
          console.error("Error fetching revenue data:", error);
        }
      };

      fetchRevenue();
    }
  }, [selectedDepartment]);

  // Prepare chart data
  const chartData = {
    labels: revenueData.monthlyRevenue, // X-axis (Date)
    datasets: [
      {
        label: "Monthly Revenue",
        data: revenueData.monthlyRevenue, // Y-axis (Monthly Revenue)
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
      {
        label: "Total Revenue",
        data: new Array(revenueData.monthlyRevenue.length).fill(
          revenueData.totalRevenue
        ), // Y-axis (Total Revenue)
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div>
      <h1>Revenue Dashboard</h1>

      {/* Department Selector */}
      <select
        value={selectedDepartment}
        onChange={(e) => setSelectedDepartment(e.target.value)}
      >
        <option value="">Select Department</option>
        {departments.map((department) => (
          <option key={department} value={department}>
            {department}
          </option>
        ))}
      </select>

      {/* Line Chart */}
      {selectedDepartment && revenueData.monthlyRevenue.length > 0 && (
        <div>
          <h3>Revenue Data for {selectedDepartment}</h3>
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
};

export default Revenue;
