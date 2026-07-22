import { PageHeader } from '../../components/PageHeader.jsx';
import { Card } from '../../components/ui/card.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.jsx';
import { EmptyState } from '../../components/StateViews.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAppData } from '../../context/AppContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { formatDate } from '../../utils/helpers.js';

const Grades = () => {
  const { auth } = useAuth();
  const { state } = useAppData();
  const { t } = useLanguage();
  const grades = state.grades.filter((g) => g.studentId === auth.studentId).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHeader title={t('grades.title')} subtitle={t('grades.subtitle')} />
      <div className="flex-1 p-6 md:p-8">
        <Card>
          {grades.length === 0 ? (
            <EmptyState title={t('grades.empty')} hint={t('grades.emptyHint')} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common.date')}</TableHead>
                  <TableHead>{t('grades.course')}</TableHead>
                  <TableHead>{t('grades.evaluation')}</TableHead>
                  <TableHead>{t('grades.score')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((g) => {
                  const course = state.courses.find((c) => c.id === g.courseId);
                  const pct = Math.round((g.score / g.maxScore) * 100);
                  return (
                    <TableRow key={g.id}>
                      <TableCell>{formatDate(g.date)}</TableCell>
                      <TableCell>{course?.name || '—'}</TableCell>
                      <TableCell>{g.type}</TableCell>
                      <TableCell>
                        <span className="me-2 font-semibold">{g.score}/{g.maxScore}</span>
                        <Badge variant={pct >= 70 ? 'success' : pct >= 50 ? 'accent' : 'destructive'}>{pct}%</Badge>
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

export default Grades;
