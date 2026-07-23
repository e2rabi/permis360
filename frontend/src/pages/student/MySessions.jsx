import { useState } from 'react';
import { PageHeader } from '../../components/PageHeader.jsx';
import { Card } from '../../components/ui/card.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.jsx';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs.jsx';
import { EmptyState } from '../../components/StateViews.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAppData } from '../../context/AppContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { formatDate, isPast } from '../../utils/helpers.js';

const MySessions = () => {
  const { auth } = useAuth();
  const { state } = useAppData();
  const { t } = useLanguage();
  const [tab, setTab] = useState('upcoming');

  const mySessions = state.sessions.filter((s) => s.assignedStudentIds.includes(auth.studentId));
  const upcoming = mySessions.filter((s) => s.status === 'scheduled' && !isPast(s.date, s.time));
  const past = mySessions.filter((s) => s.status !== 'scheduled' || isPast(s.date, s.time));
  const list = tab === 'upcoming' ? upcoming : past;

  return (
    <>
      <PageHeader title={t('mySessions.title')} subtitle={t('mySessions.subtitle')} />
      <div className="flex-1 p-6 md:p-8">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">{t('mySessions.upcoming')} ({upcoming.length})</TabsTrigger>
            <TabsTrigger value="past">{t('mySessions.past')} ({past.length})</TabsTrigger>
          </TabsList>
          <TabsContent value={tab} className="mt-0">
            <Card>
              {list.length === 0 ? (
                <EmptyState title={t('mySessions.empty')} hint={t('mySessions.emptyHint')} />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('mySessions.course')}</TableHead>
                      <TableHead>{t('mySessions.date')}</TableHead>
                      <TableHead>{t('mySessions.room')}</TableHead>
                      <TableHead>{t('mySessions.instructor')}</TableHead>
                      <TableHead>{t('common.status')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {list.map((s) => {
                      const course = state.courses.find((c) => c.id === s.courseId);
                      const instructor = state.instructors.find((i) => i.id === s.instructorId);
                      return (
                        <TableRow key={s.id}>
                          <TableCell>{course?.name}</TableCell>
                          <TableCell>{formatDate(s.date)} · {s.time}</TableCell>
                          <TableCell>{s.room}</TableCell>
                          <TableCell>{instructor?.name}</TableCell>
                          <TableCell>
                            <Badge variant={s.status === 'cancelled' ? 'destructive' : s.status === 'scheduled' ? 'success' : 'neutral'}>
                              {t(`common.${s.status}`)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default MySessions;
