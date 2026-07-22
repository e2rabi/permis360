import { PageHeader } from '../../components/PageHeader.jsx';
import { Card, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.jsx';
import { EmptyState } from '../../components/StateViews.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAppData } from '../../context/AppContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { formatDate, formatMAD } from '../../utils/helpers.js';

const Payments = () => {
  const { auth } = useAuth();
  const { state } = useAppData();
  const { t } = useLanguage();
  const enrollments = state.enrollments.filter((e) => e.studentId === auth.studentId);
  const myPayments = state.payments.filter((p) => p.studentId === auth.studentId).sort((a, b) => b.date.localeCompare(a.date));

  const overdueCourses = enrollments.filter((e) => {
    const course = state.courses.find((c) => c.id === e.courseId);
    const paid = state.payments.filter((p) => p.studentId === e.studentId && p.courseId === e.courseId).reduce((s, p) => s + p.amount, 0);
    return course && paid < course.price;
  });

  return (
    <>
      <PageHeader title={t('payments.title')} subtitle={t('payments.subtitleStudent')} />
      <div className="flex-1 space-y-5 p-6 md:p-8">
        {overdueCourses.length > 0 && (
          <Card className="border-destructive bg-destructive-soft p-4">
            <strong className="text-destructive">{t('payments.overdueBanner')}</strong>{' '}
            <span className="text-sm">{t('payments.overdueBannerBody')}</span>
          </Card>
        )}

        <div className="flex flex-col gap-3">
          {enrollments.length === 0 ? (
            <Card><EmptyState title={t('payments.nothingToShow')} /></Card>
          ) : (
            enrollments.map((e) => {
              const course = state.courses.find((c) => c.id === e.courseId);
              const paid = state.payments.filter((p) => p.studentId === e.studentId && p.courseId === e.courseId).reduce((s, p) => s + p.amount, 0);
              const remaining = Math.max(0, (course?.price || 0) - paid);
              return (
                <Card key={e.id} className="flex items-center justify-between p-5">
                  <div>
                    <h3 className="text-sm font-semibold">{course?.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{t('payments.total')} {formatMAD(course?.price)} · {t('payments.paid')} {formatMAD(paid)}</p>
                  </div>
                  <div className="text-end">
                    <div className="text-base font-bold">{formatMAD(remaining)}</div>
                    <Badge variant={remaining === 0 ? 'success' : 'destructive'}>{remaining === 0 ? t('common.paid') : t('payments.balanceDue')}</Badge>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        <Card>
          <CardHeader><CardTitle>{t('payments.history')}</CardTitle></CardHeader>
          {myPayments.length === 0 ? (
            <EmptyState title={t('payments.noHistory')} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common.date')}</TableHead>
                  <TableHead>{t('payments.course')}</TableHead>
                  <TableHead>{t('payments.amount')}</TableHead>
                  <TableHead>{t('payments.method')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myPayments.map((p) => {
                  const course = state.courses.find((c) => c.id === p.courseId);
                  return (
                    <TableRow key={p.id}>
                      <TableCell>{formatDate(p.date)}</TableCell>
                      <TableCell>{course?.name}</TableCell>
                      <TableCell>{formatMAD(p.amount)}</TableCell>
                      <TableCell className="capitalize">{t(`payments.${p.method}`)}</TableCell>
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

export default Payments;
