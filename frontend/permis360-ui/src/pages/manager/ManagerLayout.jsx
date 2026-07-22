import { Outlet } from 'react-router-dom';
import {
  LayoutDashboard, School, BookOpen, UsersRound, GraduationCap,
  Car, CalendarDays, ClipboardList, CreditCard, Bell,
} from 'lucide-react';
import { AppSidebar } from '../../components/AppSidebar.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

const ManagerLayout = () => {
  const { t } = useLanguage();

  const groups = [
    {
      section: t('nav.operations'),
      links: [
        { to: '/manager', label: t('nav.dashboard'), icon: LayoutDashboard, end: true },
        { to: '/manager/schools', label: t('nav.schools'), icon: School },
        { to: '/manager/courses', label: t('nav.courses'), icon: BookOpen },
        { to: '/manager/instructors', label: t('nav.instructors'), icon: UsersRound },
        { to: '/manager/students', label: t('nav.students'), icon: GraduationCap },
        { to: '/manager/cars', label: t('nav.fleet'), icon: Car },
        { to: '/manager/sessions', label: t('nav.sessions'), icon: CalendarDays },
      ],
    },
    {
      section: t('nav.administration'),
      links: [
        { to: '/manager/enrollments', label: t('nav.enrollments'), icon: ClipboardList },
        { to: '/manager/payments', label: t('nav.payments'), icon: CreditCard },
        { to: '/manager/notifications', label: t('nav.notifications'), icon: Bell },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen">
      <AppSidebar groups={groups} roleLabel={t('nav.managerAccount')} userName={t('common.managerUser')} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export default ManagerLayout;
