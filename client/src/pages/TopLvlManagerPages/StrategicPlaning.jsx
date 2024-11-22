import axios from "axios";
import React, { useEffect, useState } from "react";

const StrategicPlanning = () => {
  const empId = localStorage.getItem('empId');
  const [planData, setPlanData] = useState({
    goal: '',
    description: '',
    deadline: '',
    progress: '',
  });
  const [progressError, setProgressError] = useState('');
  const [planList, setPlanList] = useState([]);
  const [filteredPlanList, setFilteredPlanList] = useState([]);
  const [yearFilter, setYearFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'progress') {
      if (value < 0 || value > 100) {
        setProgressError('Progress must be between 0 and 100');
      } else {
        setProgressError('');
      }
    }

    setPlanData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (progressError) {
      alert('Please fix the errors before submitting');
      return;
    }

    const newPlan = {
      empId,
      goal: planData.goal,
      description: planData.description,
      deadline: planData.deadline,
      progress: planData.progress,
    };

    try {
      await axios.post(`http://localhost:4000/admin/addStrategicPlan/${empId}`, newPlan);
      setPlanData({
        goal: '',
        description: '',
        deadline: '',
        progress: '',
      });
      alert('Strategic Plan submitted successfully!');
    } catch (error) {
      console.error('Error submitting strategic plan:', error);
      alert('Failed to submit strategic plan.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const planResponse = await axios.get(`http://localhost:4000/admin/getPlans/${empId}`);
        setPlanList(planResponse.data);
        setFilteredPlanList(planResponse.data);
      } catch (err) {
        console.log("Error fetching data:", err);
      }
    };
    fetchData();
  }, [empId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA');
  };

  // Handle filter changes
  const handleFilterChange = () => {
    const filteredList = planList.filter((plan) => {
      const planDeadline = new Date(plan.deadline);
      const planYear = planDeadline.getFullYear();
      const planMonth = planDeadline.getMonth() + 1;

      const matchesYear = yearFilter ? planYear === parseInt(yearFilter) : true;
      const matchesMonth = monthFilter ? planMonth === parseInt(monthFilter) : true;

      return matchesYear && matchesMonth;
    });
    setFilteredPlanList(filteredList);
  };

  useEffect(() => {
    handleFilterChange();
  }, [yearFilter, monthFilter, planList]);

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Strategic Planning
      </h2>

      <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
        <h3 className="text-xl font-semibold mb-4">Add New Strategic Goal</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="goal" className="block text-sm font-semibold text-gray-700 mb-2">
              Goal
            </label>
            <input
              id="goal"
              type="text"
              placeholder="Enter Goal of Strategic Plan"
              value={planData.goal}
              onChange={handleChange}
              name="goal"
              className="border border-gray-300 rounded-lg p-3 mb-3 w-full"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter Description of Strategic Plan"
              value={planData.description}
              onChange={handleChange}
              name="description"
              className="border border-gray-300 rounded-lg p-3 mb-3 w-full"
            />
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-semibold text-gray-700 mb-2">
              Deadline
            </label>
            <input
              id="deadline"
              type="date"
              value={planData.deadline}
              onChange={handleChange}
              min={today}
              name="deadline"
              className="border border-gray-300 rounded-lg p-3 mb-3 w-full"
            />
          </div>

          <div>
            <label htmlFor="progress" className="block text-sm font-semibold text-gray-700 mb-2">
              Progress (%)
            </label>
            <input
              id="progress"
              type="number"
              value={planData.progress}
              onChange={handleChange}
              name="progress"
              className="border border-gray-300 rounded-lg p-3 mb-3 w-full"
              min="0"
              max="100"
            />
            {progressError && <p className="text-red-500 text-sm">{progressError}</p>}
          </div>

          <div>
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-300"
            >
              Add Goal
            </button>
          </div>
        </form>
      </div>
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
              {[...new Set(planList.map(plan => new Date(plan.deadline).getFullYear()))]
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
                  {new Date(0, index).toLocaleString('en-US', { month: 'long' })}
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
            </tr>
          </thead>
          <tbody>
            {filteredPlanList.length > 0 ? (
              filteredPlanList.map((plan, index) => (
                <tr key={index} className="hover:bg-gray-100 transition duration-200"
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="border border-gray-300 px-4 py-2 text-center">No startegic plans found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StrategicPlanning;
