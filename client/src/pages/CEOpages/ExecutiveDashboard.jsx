import React from "react";

const ExecutiveDashboard = () => {
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
          <p className="text-2xl font-bold text-green-600">$4.2M</p>
          <span className="text-sm text-gray-500">+15% since last quarter</span>
        </div>

        {/* Profit Margin */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700">Profit Margin</h2>
          <p className="text-2xl font-bold text-blue-600">22%</p>
          <span className="text-sm text-gray-500">Sustainable growth</span>
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
