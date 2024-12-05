import React, { useEffect, useState } from "react";
import axios from "axios";

const ExecutiveDashboard = () => {
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [avgProfitMargin, setAvgProfitMargin] = useState(null); // State for avg profit margin
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch total revenue for the last quarter
        const revenueResponse = await axios.get(
          "http://localhost:4000/employees/total-revenue/last-quarter"
        );

        // Fetch average profit margin
        const profitMarginResponse = await axios.get(
          "http://localhost:4000/employees/avg-profit-margin"
        );

        // Set the responses to state
        setTotalRevenue(revenueResponse.data.totalRevenue || 0);
        setAvgProfitMargin(profitMarginResponse.data.avgProfitMargin || 0); // Update with correct response key
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Unable to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Dashboard Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Executive Dashboard
        </h1>
        <p className="text-gray-600">
          High-level insights for strategic decisions
        </p>
      </header>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Revenue Growth */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700">
            Revenue Growth
          </h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <p className="text-2xl font-bold text-green-600">
                ${totalRevenue.toLocaleString()}
              </p>
              <span className="text-sm text-gray-500">
                Total from last quarter
              </span>
            </>
          )}
        </div>

        {/* Profit Margin */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700">
            Average Profit Margin
          </h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <p className="text-2xl font-bold text-blue-600">
                {isNaN(avgProfitMargin) ? "N/A" : avgProfitMargin.toFixed(2)}%
              </p>
              <span className="text-sm text-gray-500">
                Average for last month
              </span>
            </>
          )}
        </div>

        {/* Customer Satisfaction */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700">
            Customer Satisfaction
          </h2>
          <p className="text-2xl font-bold text-orange-600">87%</p>
          <span className="text-sm text-gray-500">Based on recent surveys</span>
        </div>

        {/* Market Share */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700">Market Share</h2>
          <p className="text-2xl font-bold text-purple-600">32%</p>
          <span className="text-sm text-gray-500">Industry-leading</span>
        </div>
      </div>

      {/* Dashboard Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Financial Performance */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Financial Performance
          </h2>
          <div className="h-48 bg-gray-200 flex items-center justify-center rounded-lg">
            {/* Placeholder for Chart */}
            <span className="text-gray-500">Chart Placeholder</span>
          </div>
        </div>

        {/* Risk Management */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Risk Management
          </h2>
          <div className="h-48 bg-gray-200 flex items-center justify-center rounded-lg">
            {/* Placeholder for Chart */}
            <span className="text-gray-500">Chart Placeholder</span>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Employee Engagement */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700">
            Employee Engagement
          </h2>
          <p className="text-2xl font-bold text-teal-600">78%</p>
          <span className="text-sm text-gray-500">
            Team productivity levels
          </span>
        </div>

        {/* Competitor Analysis */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700">
            Competitor Analysis
          </h2>
          <p className="text-2xl font-bold text-pink-600">Top 3 Rank</p>
          <span className="text-sm text-gray-500">In key markets</span>
        </div>

        {/* ESG Goals */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700">
            Sustainability
          </h2>
          <p className="text-2xl font-bold text-green-600">65%</p>
          <span className="text-sm text-gray-500">ESG goal achievement</span>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
