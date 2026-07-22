import { Navigate, Route, HashRouter, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppDataProvider } from './context/AppContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { LanguageProvider, useLanguage } from './context/LanguageContext.jsx';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';

import ManagerLayout from './pages/manager/ManagerLayout.jsx';
import Dashboard from './pages/manager/Dashboard.jsx';
import Schools from './pages/manager/Schools.jsx';
import Courses from './pages/manager/Courses.jsx';
import Instructors from './pages/manager/Instructors.jsx';
import Students from './pages/manager/Students.jsx';
import Cars from './pages/manager/Cars.jsx';
import Sessions from './pages/manager/Sessions.jsx';
import Enrollments from './pages/manager/Enrollments.jsx';
import ManagerPayments from './pages/manager/Payments.jsx';
import ManagerNotifications from './pages/manager/Notifications.jsx';

import StudentLayout from './pages/student/StudentLayout.jsx';
import Profile from './pages/student/Profile.jsx';
import Grades from './pages/student/Grades.jsx';
import BrowseCourses from './pages/student/BrowseCourses.jsx';
import MyCourses from './pages/student/MyCourses.jsx';
import MySessions from './pages/student/MySessions.jsx';
import ScheduleClass from './pages/student/ScheduleClass.jsx';
import Simulator from './pages/student/Simulator.jsx';
import ExamQuiz from './pages/student/ExamQuiz.jsx';
import StudentNotifications from './pages/student/Notifications.jsx';
import StudentPayments from './pages/student/Payments.jsx';

const RequireRole = ({ role, children }) => {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/login" replace />;
  if (auth.role !== role) return <Navigate to={auth.role === 'manager' ? '/manager' : '/student'} replace />;
  return children;
};

const RootRedirect = () => <Navigate to="/" replace />;

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />

    <Route path="/manager" element={<RequireRole role="manager"><ManagerLayout /></RequireRole>}>
      <Route index element={<Dashboard />} />
      <Route path="schools" element={<Schools />} />
      <Route path="courses" element={<Courses />} />
      <Route path="instructors" element={<Instructors />} />
      <Route path="students" element={<Students />} />
      <Route path="cars" element={<Cars />} />
      <Route path="sessions" element={<Sessions />} />
      <Route path="enrollments" element={<Enrollments />} />
      <Route path="payments" element={<ManagerPayments />} />
      <Route path="notifications" element={<ManagerNotifications />} />
    </Route>

    <Route path="/student" element={<RequireRole role="student"><StudentLayout /></RequireRole>}>
      <Route index element={<Profile />} />
      <Route path="grades" element={<Grades />} />
      <Route path="courses" element={<BrowseCourses />} />
      <Route path="my-courses" element={<MyCourses />} />
      <Route path="sessions" element={<MySessions />} />
      <Route path="schedule" element={<ScheduleClass />} />
      <Route path="simulator" element={<Simulator />} />
      <Route path="exam" element={<ExamQuiz />} />
      <Route path="notifications" element={<StudentNotifications />} />
      <Route path="payments" element={<StudentPayments />} />
    </Route>

    <Route path="*" element={<RootRedirect />} />
  </Routes>
);

const ToasterWithDir = () => {
  const { dir } = useLanguage();
  return <Toaster position={dir === 'rtl' ? 'top-left' : 'top-right'} dir={dir} richColors closeButton />;
};

const App = () => (
  <LanguageProvider>
    <AppDataProvider>
      <AuthProvider>
        <HashRouter>
          <AppRoutes />
          <ToasterWithDir />
        </HashRouter>
      </AuthProvider>
    </AppDataProvider>
  </LanguageProvider>
);

export default App;
