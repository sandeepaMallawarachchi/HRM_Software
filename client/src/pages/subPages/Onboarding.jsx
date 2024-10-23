import React from "react";

const Onboarding = () => {
  const tasks = [
    { id: 1, task: "Fill out personal information form", status: "Incomplete" },
    { id: 2, task: "Review employee handbook", status: "Incomplete" },
    {
      id: 3,
      task: "Complete security and compliance training",
      status: "Incomplete",
    },
    { id: 4, task: "Set up company email and accounts", status: "Incomplete" },
  ];

  return (
    <div className="m-10 p-6 px-20 bg-[#eaeaea] rounded-lg shadow-md">
      <h3 className="text-2xl text-gray-700 mb-4">
        Onboarding Tasks
      </h3>
      <p className="text-gray-600 mb-6">
        Welcome to the company! Please complete the tasks below to finalize your
        onboarding process.
      </p>

      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between bg-gray-50 p-4 border rounded-lg shadow-sm"
          >
            <span className="text-gray-700">{task.task}</span>
            <span
              className={`px-2 py-1 rounded-full text-sm ${
                task.status === "Incomplete"
                  ? "bg-red-100 text-red-500"
                  : "bg-green-100 text-green-500"
              }`}
            >
              {task.status}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <button className="bg-orange-500 text-white px-4 py-2 rounded-[20px] shadow hover:bg-orange-600 transition">
          Start Training
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
