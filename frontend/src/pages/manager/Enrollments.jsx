import { useMemo, useState } from 'react';
import { PageHeader } from '../../components/PageHeader.jsx';
import { Card } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.jsx';
import { EmptyState } from '../../components/StateViews.jsx';
import { useAppData } from '../../context/AppContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { formatDate, makeId, todayISO } from '../../utils/helpers.js';

const Enrollments = () => {
  const { t } = useLanguage();
  const { state, addItem, updateItem, deleteItem, pushToast } = useAppData();
  const [courseId, setCourseId] = useState(state.courses[0]?.id || '');
  const [filter, setFilter] = useState('all');
  const [addStudentId, setAddStudentId] = useState('');

  const courseEnrollments = useMemo(() => state.enrollments.filter((e) => e.courseId === courseId), [state.enrollments, courseId]);

  const paidStatus = (studentId) => {
    const course = state.courses.find((c) => c.id === courseId);
    const paid = state.payments.filter((p) => p.studentId === studentId && p.courseId === courseId).reduce((s, p) => s + p.amount, 0);
    if (!course) return 'unpaid';
    if (paid >= course.price) return 'paid';
    if (paid > 0) return 'partial';
    return 'unpaid';
  };

  const filtered = courseEnrollments.filter((e) => {
    if (filter === 'all') return true;
    if (filter === 'unpaid') return paidStatus(e.studentId) !== 'paid';
    return e.status === filter;
  });

  const eligibleToAdd = state.students.filter((s) => s.active && !courseEnrollments.some((e) => e.studentId === s.id));

  const handleAdd = () => {
    if (!addStudentId) return;
    const course = state.courses.find((c) => c.id === courseId);
    if (course.status !== 'open') { pushToast(t('enrollments.closed'), 'danger'); return; }
    addItem('enrollments', { id: makeId('enr'), studentId: addStudentId, courseId, status: 'active', enrolledAt: todayISO() });
    pushToast(t('enrollments.enrolled'), 'success');
    setAddStudentId('');
  };

  const handleRemove = (enrollment) => {
    const hasSessions = state.sessions.some((s) => s.courseId === courseId && s.assignedStudentIds.includes(enrollment.studentId));
    deleteItem('enrollments', enrollment.id);
    if (hasSessions) {
      state.sessions
        .filter((s) => s.courseId === courseId && s.assignedStudentIds.includes(enrollment.studentId))
        .forEach((s) => updateItem('sessions', s.id, { assignedStudentIds: s.assignedStudentIds.filter((id) => id !== enrollment.studentId) }));
    }
    pushToast(t('enrollments.removed'));
  };

  const exportCsv = () => {
    const course = state.courses.find((c) => c.id === courseId);
    const rows = [['Student', 'CIN', 'Status', 'Payment', 'Enrolled on']];
    filtered.forEach((e) => {
      const student = state.students.find((s) => s.id === e.studentId);
      rows.push([student?.name || '', student?.cin || '', e.status, paidStatus(e.studentId), e.enrolledAt]);
    });
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(course?.name || 'course').replace(/\s+/g, '_')}_enrollment.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader title={t('enrollments.title')} subtitle={t('enrollments.subtitle')} />
      <div className="flex-1 p-6 md:p-8">
        <Card>
          <div className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {state.courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('enrollments.allStudents')}</SelectItem>
                  <SelectItem value="unpaid">{t('enrollments.unpaidPartial')}</SelectItem>
                  <SelectItem value="active">{t('enrollments.activeEnrollment')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" onClick={exportCsv}>{t('common.export')}</Button>
          </div>

          <div className="border-b px-5 py-4">
            <div className="flex gap-2">
              <Select value={addStudentId} onValueChange={setAddStudentId}>
                <SelectTrigger className="flex-1"><SelectValue placeholder={t('enrollments.enrollPlaceholder')} /></SelectTrigger>
                <SelectContent>
                  {eligibleToAdd.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button size="sm" onClick={handleAdd} disabled={!addStudentId}>{t('enrollments.enroll')}</Button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState title={t('enrollments.empty')} hint={t('enrollments.emptyHint')} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('sessions.student')}</TableHead>
                  <TableHead>{t('enrollments.cin')}</TableHead>
                  <TableHead>{t('enrollments.enrolledOn')}</TableHead>
                  <TableHead>{t('enrollments.enrollmentStatus')}</TableHead>
                  <TableHead>{t('enrollments.payment')}</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((e) => {
                  const student = state.students.find((s) => s.id === e.studentId);
                  const status = paidStatus(e.studentId);
                  return (
                    <TableRow key={e.id}>
                      <TableCell className="font-semibold">{student?.name || '—'}</TableCell>
                      <TableCell className="font-mono text-xs">{student?.cin || '—'}</TableCell>
                      <TableCell>{formatDate(e.enrolledAt)}</TableCell>
                      <TableCell><Badge variant={e.status === 'active' ? 'success' : 'neutral'}>{e.status}</Badge></TableCell>
                      <TableCell>
                        <Badge variant={status === 'paid' ? 'success' : status === 'partial' ? 'accent' : 'destructive'}>
                          {t(`common.${status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell><Button variant="outline" size="sm" onClick={() => handleRemove(e)}>{t('common.remove')}</Button></TableCell>
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

export default Enrollments;
