import { PageHeader } from '../../components/PageHeader.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.jsx';
import { EmptyState } from '../../components/StateViews.jsx';
import { useAppData } from '../../context/AppContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { formatDate, formatMAD } from '../../utils/helpers.js';

const Dashboard = () => {
  const { state } = useAppData();
  const { t } = useLanguage();
  const { schools, courses, instructors, students, cars, sessions, payments, enrollments } = state;

  const totalRevenueExpected = courses.reduce((sum, c) => {
    const enrolledCount = enrollments.filter((e) => e.courseId === c.id && e.status === 'active').length;
    return sum + enrolledCount * c.price;
  }, 0);
  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const outstanding = Math.max(0, totalRevenueExpected - totalCollected);

  const upcomingSessions = [...sessions]
    .filter((s) => s.status === 'scheduled')
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 5);

  const stats = [
    { value: courses.length, label: t('dashboard.courses') },
    { value: instructors.filter((i) => i.active).length, label: t('dashboard.activeInstructors') },
    { value: students.filter((s) => s.active).length, label: t('dashboard.activeStudents') },
    { value: `${cars.filter((c) => c.status === 'available').length}/${cars.length}`, label: t('dashboard.carsAvailable') },
    { value: formatMAD(totalCollected), label: t('dashboard.collected') },
    { value: formatMAD(outstanding), label: t('dashboard.outstanding'), danger: outstanding > 0 },
  ];

  return (
    <>
      <PageHeader title={t('dashboard.title')} subtitle={`${schools[0]?.name || ''} · ${t('dashboard.subtitle')}`} />
      <div className="flex-1 space-y-6 p-6 md:p-8">
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((s, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className={`font-display text-2xl font-semibold ${s.danger ? 'text-destructive' : 'text-primary'}`}>
                  {s.value}
                </div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>{t('dashboard.upcomingSessions')}</CardTitle>
              <CardDescription className="mt-1">{t('dashboard.upcomingHint')}</CardDescription>
            </div>
          </CardHeader>
          {upcomingSessions.length === 0 ? (
            <EmptyState title={t('dashboard.noSessions')} hint={t('dashboard.noSessionsHint')} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('dashboard.course')}</TableHead>
                  <TableHead>{t('common.date')}</TableHead>
                  <TableHead>{t('dashboard.room')}</TableHead>
                  <TableHead>{t('dashboard.instructor')}</TableHead>
                  <TableHead>{t('dashboard.seats')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingSessions.map((s) => {
                  const course = courses.find((c) => c.id === s.courseId);
                  const instructor = instructors.find((i) => i.id === s.instructorId);
                  return (
                    <TableRow key={s.id}>
                      <TableCell>{course?.name || '—'}</TableCell>
                      <TableCell>{formatDate(s.date)} · {s.time}</TableCell>
                      <TableCell>{s.room}</TableCell>
                      <TableCell>{instructor?.name || '—'}</TableCell>
                      <TableCell>
                        <Badge variant={s.assignedStudentIds.length >= s.seats ? 'destructive' : 'primary'}>
                          {s.assignedStudentIds.length}/{s.seats}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
