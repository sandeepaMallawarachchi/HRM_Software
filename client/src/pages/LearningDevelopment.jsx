import React, { useState } from "react";
import "../components/CSS/LearningDevelopment.css";
import CertificationsAchievements from "../components/leaningComponents/CertificationsAchievements";
import LearningCalander from "../components/leaningComponents/LearningCalander";

const LearningDevelopment = () => {

  return (
    <div className="p-5">
      <div className="grid grid-cols-3 gap-6 p-6">
        {/* Training and Courses Overview */}
        <div className="card bg-gray-100 border border-gray-300 rounded-lg p-5 ">
          <h2 className="text-lg font-semibold">
            Training and Courses Overview
          </h2>
          <div className="mt-4">
            <h3 className="font-semibold">Ongoing Tasks</h3>
            <ul className="list-disc list-inside ml-5">
              <li className="text-orange-600 bg-orange-100 p-2 rounded">
                Full-Stack Development (60% complete)
              </li>
            </ul>
            <h3 className="font-semibold mt-4">Completed Tasks</h3>
            <ul className="list-disc list-inside ml-5">
              <li className="text-yellow-600 bg-yellow-100 p-2 rounded">
                Intro to JavaScript
              </li>
              <li className="text-yellow-600 bg-yellow-100 p-2 rounded">
                Git & GitHub Basics
              </li>
            </ul>
            <h3 className="font-semibold mt-4">Upcoming Tasks</h3>
            <ul className="list-disc list-inside ml-5">
              <li className="text-blue-600 bg-blue-100 p-2 rounded">
                Advanced React.js Workshop on November 5, 2024
              </li>
            </ul>
          </div>
        </div>

        {/* Learning Progress */}
        <div className="card bg-gray-100 border border-gray-300 rounded-lg p-5 ">
          <h2 className="text-lg font-semibold">Learning Progress</h2>
          <p>Overall Progress: 70%</p>
          <div>
            <p>Full-Stack Development: 60%</p>
            <progress value="60" max="100" className="w-full bg-white" />
          </div>
          <div>
            <p>Intro to JavaScript: 100%</p>
            <progress value="100" max="100" className="w-full" />
          </div>
          <div>
            <p>Git & GitHub Basics: 100%</p>
            <progress value="100" max="100" className="w-full" />
          </div>

          {/* Add space for the image */}
          <div className="mt-4">
            {" "}
            {/* Tailwind class for margin-top */}
            <img
              src={require("../images/devloper.gif")} // Use the correct path here
              alt="Learning Progress"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Certifications and Achievements */}
        <CertificationsAchievements />

        {/* Skills and Competencies */}
        <div className="card bg-gradient-to-r from-indigo-500 to-indigo-300 text-white rounded-lg p-5  transition-shadow duration-300 hover:shadow-lg">
          <h2 className="text-lg font-semibold mb-4">
            Skills and Competencies
          </h2>
          <ul className="space-y-3">
            <li className="flex justify-between items-center">
              <span className="text-sm">JavaScript</span>
              <span className="text-sm bg-white text-indigo-600 rounded-full px-3 py-1">
                Intermediate
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-sm">React.js</span>
              <span className="text-sm bg-white text-indigo-600 rounded-full px-3 py-1">
                Intermediate
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-sm">Node.js</span>
              <span className="text-sm bg-white text-indigo-600 rounded-full px-3 py-1">
                Beginner
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-sm">Git</span>
              <span className="text-sm bg-white text-indigo-600 rounded-full px-3 py-1">
                Intermediate
              </span>
            </li>
          </ul>
        </div>

        {/* Learning Calendar */}
        <LearningCalander />

        {/* Career Development Plan */}
        <div className="card bg-gradient-to-r from-blue-500 to-blue-300 text-black rounded-lg p-5  transition-shadow duration-300 hover:shadow-lg">
          <h2 className="text-lg font-semibold mb-4">
            Career Development Plan
          </h2>
          <p className="text-sm mb-2">
            Current Role:{" "}
            <span className="font-semibold">Junior Software Developer</span>
          </p>
          <p className="text-sm mb-2">
            Goal:{" "}
            <span className="font-semibold">
              Move to Senior Software Developer within 2 years
            </span>
          </p>

          <h3 className="text-md font-semibold mt-4">Steps to Achieve Goal:</h3>
          <ul className="list-disc list-inside ml-5 space-y-2 mt-2">
            <li className="text-sm">Complete Advanced React.js course</li>
            <li className="text-sm">Master data structures and algorithms</li>
            <li className="text-sm">Gain project leadership experience</li>
          </ul>
        </div>

        {/* Peer and Mentor Interaction */}
        <div className="card bg-gradient-to-r from-blue-500 to-blue-300 text-black rounded-lg p-5  transition-shadow duration-300 hover:shadow-lg">
          <h2 className="text-lg  font-semibold mb-2">
            Peer and Mentor Interaction
          </h2>
          <div className="flex items-center mb-4">
            <div className="bg-white text-blue-500 rounded-full w-10 h-10 flex items-center justify-center mr-3">
              <span className="font-bold">JD</span> {/* Mentor Initials */}
            </div>
            <div>
              <p className="text-sm">
                Current Mentor: John Doe (Senior Developer)
              </p>
              <p className="text-sm">
                Next Mentorship Meeting: November 1, 2024
              </p>
            </div>
          </div>
          <p className="text-sm italic">
            Recent Feedback: "Great progress on understanding backend concepts."
          </p>
        </div>

        {/* Personalized Recommendations */}
        <div className="card bg-gradient-to-r from-green-400 to-green-300 text-black rounded-lg p-5  transition-shadow duration-300 hover:shadow-lg">
          <h2 className="text-lg font-semibold mb-2">
            Personalized Recommendations
          </h2>
          <p className="text-sm mb-2">Recommended Skill Focus:</p>
          <p className="text-sm italic">
            Learn TypeScript for better React code quality.
          </p>

          <p className="text-sm mb-2 mt-4">Suggested Training:</p>
          <ul className="list-disc list-inside ml-5">
            <li className="text-sm">TypeScript in Depth</li>
            <li className="text-sm">Redux for State Management</li>
          </ul>
        </div>

        {/* Performance Metrics */}
        <div className="card bg-gradient-to-r from-purple-500 to-purple-300 text-black rounded-lg p-5  transition-shadow duration-300 hover:shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Performance Metrics</h2>
          <ul className="list-disc list-inside ml-5">
            <li className="text-sm">
              Total Hours Spent on Learning:{" "}
              <span className="font-semibold">45 hours</span>
            </li>
            <li className="text-sm">
              Weekly Learning Time:{" "}
              <span className="font-semibold">5 hours</span> on average
            </li>
            <li className="text-sm">
              Completion Rate: <span className="font-semibold">80%</span> of
              assigned courses
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LearningDevelopment;
