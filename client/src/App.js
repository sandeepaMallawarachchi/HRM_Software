import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./index.css";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar.jsx";
import Profile from "./components/Profile";
import Payroll from "./pages/Payroll";
import EmployeeRegistration from "./pages/auth/EmployeeRegistration";
import LeaveAndAttendance from "./pages/LeaveAndAttendance";
import LearningDevelopment from "./pages/LearningDevelopment";
import AttendanceAndTime from "./pages/AttendanceAndTime";
import ReminderPage from "./pages/subPages/ReminderPage.jsx";

//team leader routes
import TeamManage from "./pages/TeamLeaderPages/TeamManage";
import Reporting from "./pages/TeamLeaderPages/Reporting";
import Communication from "./pages/TeamLeaderPages/Communication";

//Mid Lvl Managers routes
import PerformanceManage from "./pages/MidLvlMangersPages/PerformanceManage";
import ResourceAllocation from "./pages/MidLvlMangersPages/ResourceAllocation";
import ReportsandAnalytics from "./pages/MidLvlMangersPages/ReportsandAnalytics";
import ConflictResolutions from "./pages/MidLvlMangersPages/ConflictResolutions";
import TrainingOversite from "./pages/MidLvlMangersPages/TrainingOversite";

//Top Levl Managers routes
import StrategicPlaning from "./pages/TopLvlManagerPages/StrategicPlaning";
import PerformanceDashboard from "./pages/TopLvlManagerPages/PerformanceDashboard";
import SuccessPlaning from "./pages/TopLvlManagerPages/SuccessPlaning";
import Budgeting from "./pages/TopLvlManagerPages/Budgeting";
import CompilenceTrack from "./pages/TopLvlManagerPages/CompilenceTrack";

//Ceo routes
import ExecutiveDashboard from "./pages/CEOpages/ExecutiveDashboard";
import StrategicInsights from "./pages/CEOpages/StrategicInsights";
import TalentManagement from "./pages/CEOpages/TalentManagement";
import CultureandEngagement from "./pages/CEOpages/CultureandEngagement";
import DecitionSupport from "./pages/CEOpages/DecitionSupport";

//auth routes
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import Login from "./pages/auth/Login";
import Offers from "./pages/subPages/Offers";
import Onboarding from "./pages/subPages/Onboarding";

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div className="flex h-screen">
      {!isLoginPage && <Sidebar />}
      <div
        className={`flex-1 flex flex-col ${!isLoginPage ? "ml-[-35px]" : ""}`}
      >
        {!isLoginPage && <Header />}
        <div className="flex-1 p-4 pl-10 overflow-auto bg-[#f6f5fb]">
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<Dashboard />} />}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute element={<Profile />} />}
            />
            <Route
              path="/payroll"
              element={<ProtectedRoute element={<Payroll />} />}
            />
            <Route
              path="/registration"
              element={<ProtectedRoute element={<EmployeeRegistration />} />}
            />
            <Route
              path="/leave"
              element={<ProtectedRoute element={<LeaveAndAttendance />} />}
            />
            <Route
              path="/attendance"
              element={<ProtectedRoute element={<AttendanceAndTime />} />}
            />
            <Route
              path="/learn"
              element={<ProtectedRoute element={<LearningDevelopment />} />}
            />
            <Route
              path="/offers"
              element={<ProtectedRoute element={<Offers />} />}
            />
            <Route
              path="/onboarding"
              element={<ProtectedRoute element={<Onboarding />} />}
            />
            <Route
              path="/team-management"
              element={<ProtectedRoute element={<TeamManage />} />}
            />
            <Route
              path="/reporting"
              element={<ProtectedRoute element={<Reporting />} />}
            />
            <Route
              path="/communication"
              element={<ProtectedRoute element={<Communication />} />}
            />
            <Route
              path="performance-management"
              element={<ProtectedRoute element={<PerformanceManage />} />}
            />
            <Route
              path="/resource-allocation"
              element={<ProtectedRoute element={<ResourceAllocation />} />}
            />
            <Route
              path="/reporting-analytics"
              element={<ProtectedRoute element={<ReportsandAnalytics />} />}
            />
            <Route
              path="/conflict-resolution"
              element={<ProtectedRoute element={<ConflictResolutions />} />}
            />
            <Route
              path="/training-oversight"
              element={<ProtectedRoute element={<TrainingOversite />} />}
            />
            <Route
              path="/strategic-planning"
              element={<ProtectedRoute element={<StrategicPlaning />} />}
            />
            <Route
              path="/performance-dashboards"
              element={<ProtectedRoute element={<PerformanceDashboard />} />}
            />
            <Route
              path="/succession-planning"
              element={<ProtectedRoute element={<SuccessPlaning />} />}
            />
            <Route
              path="/budgeting"
              element={<ProtectedRoute element={<Budgeting />} />}
            />
            <Route
              path="/compliance-tracking"
              element={<ProtectedRoute element={<CompilenceTrack />} />}
            />
            <Route
              path="/executive-dashboard"
              element={<ProtectedRoute element={<ExecutiveDashboard />} />}
            />
            <Route
              path="/strategic-insights"
              element={<ProtectedRoute element={<StrategicInsights />} />}
            />
            <Route
              path="/talent-management"
              element={<ProtectedRoute element={<TalentManagement />} />}
            />
            <Route
              path="/culture-engagement"
              element={<ProtectedRoute element={<CultureandEngagement />} />}
            />
            <Route
              path="/decision-support"
              element={<ProtectedRoute element={<DecitionSupport />} />}
            />
            <Route
              path="/decision-support"
              element={<ProtectedRoute element={<DecitionSupport />} />}
            />
            <Route
              path="/reminders"
              element={<ProtectedRoute element={<ReminderPage />} />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
