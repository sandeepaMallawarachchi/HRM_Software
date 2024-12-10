import React from "react";
import "../components/CSS/LearningDevelopment.css";
import CertificationsAchievements from "../components/leaningComponents/CertificationsAchievements";
import LearningCalander from "../components/leaningComponents/LearningCalander";
import TrainingAndTasks from "../components/leaningComponents/TrainingAndTasks";
import SkillsAndCompetencies from "../components/leaningComponents/SkillsAndCompetencies";
import CareerPlans from "../components/leaningComponents/CareePlans";
import MentorFeedback from "../components/leaningComponents/MentorFeedback";
import PersonalizedRecommendations from '../components/leaningComponents/PersonalizedRecommendations';
import PerformanceMetrics from "../components/leaningComponents/PerformanceMetrics";

const LearningDevelopment = () => {

  return (
    <div className="p-5">
      <div className="grid grid-cols-3 gap-6 p-6">
        {/* Training and Courses Overview */}
        <TrainingAndTasks />

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
        <SkillsAndCompetencies />

        {/* Learning Calendar */}
        <LearningCalander />

        {/* Career Development Plan */}
        <CareerPlans />

        {/* Peer and Mentor Interaction */}
        <MentorFeedback />

        {/* Personalized Recommendations */}
        <PersonalizedRecommendations />

        {/* Performance Metrics */}
        <PerformanceMetrics />

      </div>
    </div>
  );
};

export default LearningDevelopment;
