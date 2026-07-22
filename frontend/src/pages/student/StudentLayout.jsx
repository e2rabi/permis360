import { Outlet } from 'react-router-dom';
import {
  User, BarChart3, BookOpen, Backpack, CalendarDays,
  UsersRound, Gamepad2, Bell, CreditCard, GraduationCap,
} from 'lucide-react';
import { AppSidebar } from '../../components/AppSidebar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAppData } from '../../context/AppContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

const StudentLayout = () => {
  const { auth } = useAuth();
  const { state } = useAppData();
  const { t } = useLanguage();
  const student = state.students.find((s) => s.id === auth.studentId);

  const groups = [
    {
      section: t('nav.mySpace'),
      links: [
        { to: '/student', label: t('nav.profile'), icon: User, end: true },
        { to: '/student/grades', label: t('nav.grades'), icon: BarChart3 },
        { to: '/student/courses', label: t('nav.browseCourses'), icon: BookOpen },
        { to: '/student/my-courses', label: t('nav.myCourses'), icon: Backpack },
        { to: '/student/sessions', label: t('nav.mySessions'), icon: CalendarDays },
        { to: '/student/schedule', label: t('nav.schedule'), icon: UsersRound },
        { to: '/student/simulator', label: t('nav.simulator'), icon: Gamepad2 },
        { to: '/student/exam', label: t('nav.examQuiz'), icon: GraduationCap },
        { to: '/student/notifications', label: t('nav.notifications'), icon: Bell },
        { to: '/student/payments', label: t('nav.payments'), icon: CreditCard },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen">
      <AppSidebar groups={groups} roleLabel={t('nav.studentAccount')} userName={student ? student.name : t('nav.studentAccount')} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;
