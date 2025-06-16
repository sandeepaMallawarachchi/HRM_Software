import axios from "axios";
import React, { useEffect, useState } from "react";

const CurrentStrategicGoals = () => {
  const empId = localStorage.getItem("empId");
  const [planList, setPlanList] = useState([]);
  const [filteredPlanList, setFilteredPlanList] = useState([]);
  const [yearFilter, setYearFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [progressUpdate, setProgressUpdate] = useState({});

  const fetchData = async () => {
    try {
      const planResponse = await axios.get(
        `https://global-hrm-mobile-server.vercel.app/admin/getPlans/${empId}`
      );
      setPlanList(planResponse.data);
      setFilteredPlanList(planResponse.data);
    } catch (err) {
      console.log("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [empId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-CA");
  };

  const handleUpdateProgress = async (planId) => {
    const newProgress = progressUpdate[planId];
    if (newProgress === undefined || newProgress < 0 || newProgress > 100) {
      alert("Please enter a valid progress percentage between 0 and 100.");
      return;
    }

    try {
      const response = await axios.put(
        `https://global-hrm-mobile-server.vercel.app/admin/updateProgress/${planId}`,
        { progress: newProgress }
      );
      alert(response.data.message);
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  // Handle filter changes
  const handleFilterChange = () => {
    const filteredList = planList.filter((plan) => {
      const planDeadline = new Date(plan.deadline);
      const planYear = planDeadline.getFullYear();
      const planMonth = planDeadline.getMonth() + 1;

      const matchesYear = yearFilter ? planYear === parseInt(yearFilter) : true;
      const matchesMonth = monthFilter
        ? planMonth === parseInt(monthFilter)
        : true;

      return matchesYear && matchesMonth;
    });
    setFilteredPlanList(filteredList);
  };

  useEffect(() => {
    handleFilterChange();
  }, [yearFilter, monthFilter, planList]);

  return (
    <div className="p-6 px-20 bg-gray-100 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Current Strategic Goals</h3>
      <div className="overflow-x-auto">
        {/* Filters */}
        <div className="flex space-x-4 mt-5">
          <div>
            <label className="block text-gray-700">Filter by Year</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="border-none rounded-md p-2 w-full"
            >
              <option value="">All Years</option>
              {[
                ...new Set(
                  planList.map((plan) => new Date(plan.deadline).getFullYear())
                ),
              ]
                .sort((a, b) => b - a)
                .map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
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
                  {new Date(0, index).toLocaleString("en-US", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
          </div>
        </div>

        <table className="mt-5 min-w-full bg-white rounded-lg shadow-lg border border-gray-300">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Goal</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Deadline</th>
              <th className="border border-gray-300 px-4 py-2">Progress</th>
              <th className="border border-gray-300 px-4 py-2">
                Update Progress
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPlanList.length > 0 ? (
              filteredPlanList.map((plan, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {plan.goal}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {plan.description}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {formatDate(plan.deadline)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {plan.progress}%
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={progressUpdate[plan.id] || ""}
                      onChange={(e) =>
                        setProgressUpdate({
                          ...progressUpdate,
                          [plan.id]: e.target.value,
                        })
                      }
                      className="p-2 border rounded-md"
                    />
                    <button
                      onClick={() => handleUpdateProgress(plan.id)}
                      className="ml-2 text-blue-500"
                    >
                      Update Progress
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="border border-gray-300 px-4 py-2 text-center"
                >
                  No strategic plans found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CurrentStrategicGoals;
