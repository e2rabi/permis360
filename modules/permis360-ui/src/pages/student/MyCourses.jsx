import { useState } from 'react';
import { PageHeader } from '../../components/PageHeader.jsx';
import { Card } from '../../components/ui/card.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs.jsx';
import { EmptyState } from '../../components/StateViews.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAppData } from '../../context/AppContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { formatDate, formatMAD } from '../../utils/helpers.js';

const MyCourses = () => {
  const { auth } = useAuth();
  const { state } = useAppData();
  const { t } = useLanguage();
  const [tab, setTab] = useState('enrolled');

  const enrollments = state.enrollments.filter((e) => e.studentId === auth.studentId);
  const taking = enrollments.filter((e) => {
    const course = state.courses.find((c) => c.id === e.courseId);
    return course && course.status === 'open' && e.status === 'active';
  });

  const list = tab === 'enrolled' ? enrollments : taking;

  return (
    <>
      <PageHeader title={t('myCourses.title')} subtitle={t('myCourses.subtitle')} />
      <div className="flex-1 p-6 md:p-8">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="enrolled">{t('myCourses.allEnrolled')} ({enrollments.length})</TabsTrigger>
            <TabsTrigger value="taking">{t('myCourses.currentlyTaking')} ({taking.length})</TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-0">
            {list.length === 0 ? (
              <Card><EmptyState title={t('myCourses.empty')} hint={t('myCourses.emptyHint')} /></Card>
            ) : (
              <div className="flex flex-col gap-4">
                {list.map((e) => {
                  const course = state.courses.find((c) => c.id === e.courseId);
                  const paid = state.payments.filter((p) => p.studentId === e.studentId && p.courseId === e.courseId).reduce((s, p) => s + p.amount, 0);
                  const isPaid = paid >= (course?.price || 0);
                  return (
                    <Card key={e.id} className="flex items-center justify-between p-5">
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <h3 className="font-display text-base font-semibold">{course?.name}</h3>
                          <Badge variant="primary">{course?.category}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {t('myCourses.enrolledOn')} {formatDate(e.enrolledAt)} · {t('myCourses.startsOn')} {formatDate(course?.startDate)}
                        </p>
                      </div>
                      <div className="text-end">
                        <div className="text-sm">{formatMAD(paid)} / {formatMAD(course?.price)}</div>
                        <Badge variant={isPaid ? 'success' : 'accent'}>{isPaid ? t('myCourses.paidInFull') : t('myCourses.balanceDue')}</Badge>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default MyCourses;
