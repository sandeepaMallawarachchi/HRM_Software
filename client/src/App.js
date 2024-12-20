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
import Communication from "./components/Communication.jsx";
import PostList from "./pages/Newspaper";
import StickyCard from "./pages/StickyCard";
import MedicalClaim from "./pages/MedicalClaim.jsx";

//team leader routes
import TeamManage from "./pages/TeamLeaderPages/TeamManage";
import Reporting from "./pages/TeamLeaderPages/Reporting";

//Mid Lvl Managers routes
import PerformanceManage from "./pages/MidLvlMangersPages/PerformanceManage";
import ResourceAllocation from "./pages/MidLvlMangersPages/ResourceAllocation";
import ReportsandAnalytics from "./pages/MidLvlMangersPages/ReportsandAnalytics";
// import ConflictResolutions from "./pages/MidLvlMangersPages/ConflictResolutions";
import TrainingOversite from "./pages/supervisorPages/TrainingOversite.jsx";

//supervisor routes
import SupervicerDashboard from "./pages/supervisorPages/SupervisorDashboard.jsx";

//Top Levl Managers routes
import StrategicPlaning from "./pages/TopLvlManagerPages/StrategicPlaning";
import PerformanceDashboard from "./pages/TopLvlManagerPages/PerformanceDashboard";

import Budgeting from "./pages/TopLvlManagerPages/Budgeting";

import PostForm from "./pages/TopLvlManagerPages/PostToFeed";

//Accountant routes
import Expenses from "./pages/AccountantPages/Expenses";
import Profit from "./pages/AccountantPages/Profit";
import Revenue from "./pages/AccountantPages/Revenue";
import LoansSection from "./pages/AccountantPages/LoansSection";

//HR routes
import EmployeeRelationships from "./pages/HRpages/EmployeeRelationships";
import PayrollManagement from "./pages/HRpages/PayrollManagement";
import Policies from "./pages/HRpages/Policies";
import PolicyManagement from "./pages/HRpages/PolicyManagement";
import SalaryDeduction from "./pages/HRpages/SalaryDeduction";

//Ceo routes
import ExecutiveDashboard from "./pages/CEOpages/ExecutiveDashboard";
import StrategicInsights from "./pages/CEOpages/StrategicInsights";

import Meetings from "./pages/CEOpages/Meetings";
import DecitionSupport from "./pages/CEOpages/DecitionSupport";

//auth routes
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import Login from "./pages/auth/Login";
import Offers from "./pages/subPages/Offers";
import Onboarding from "./pages/subPages/Onboarding";
import PreApprovals from "./pages/HRpages/PreApprovals";

//not found page
import NotFound from "./components/NotFound.jsx";

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
            {/* Catch-all 404 route */}
            <Route path="*" element={<NotFound />} />

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
              path="/medical"
              element={<ProtectedRoute element={<MedicalClaim />} />}
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
              path="/pre-approvals"
              element={<ProtectedRoute element={<PreApprovals />} />}
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
              path="/supervisor"
              element={<ProtectedRoute element={<SupervicerDashboard />} />}
            />
            <Route
              path="/training-versite"
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
              path="/budgeting"
              element={<ProtectedRoute element={<Budgeting />} />}
            />

            <Route
              path="/expences"
              element={<ProtectedRoute element={<Expenses />} />}
            />
            <Route
              path="/profits"
              element={<ProtectedRoute element={<Profit />} />}
            />
            <Route
              path="/Revenue"
              element={<ProtectedRoute element={<Revenue />} />}
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
              path="/decision-support"
              element={<ProtectedRoute element={<DecitionSupport />} />}
            />
            <Route
              path="/meetings"
              element={<ProtectedRoute element={<Meetings />} />}
            />
            <Route
              path="/reminders"
              element={<ProtectedRoute element={<ReminderPage />} />}
            />
            <Route
              path="/employee-relations"
              element={<ProtectedRoute element={<EmployeeRelationships />} />}
            />
            <Route
              path="/payroll-management"
              element={<ProtectedRoute element={<PayrollManagement />} />}
            />
            <Route
              path="/policy-management"
              element={<ProtectedRoute element={<Policies />} />}
            />
            <Route
              path="/manage-policies"
              element={<ProtectedRoute element={<PolicyManagement />} />}
            />

            <Route
              path="/newspaper"
              element={<ProtectedRoute element={<PostList />} />}
            />
            <Route
              path="/posttofeed"
              element={<ProtectedRoute element={<PostForm />} />}
            />
            <Route
              path="/sticky-cards"
              element={<ProtectedRoute element={<StickyCard />} />}
            />
            <Route
              path="/salary-deduction"
              element={<ProtectedRoute element={<SalaryDeduction />} />}
            />
            <Route
              path="/loansection"
              element={<ProtectedRoute element={<LoansSection />} />}
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
