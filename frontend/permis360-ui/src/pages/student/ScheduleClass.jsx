import { useState } from 'react';
import { PageHeader } from '../../components/PageHeader.jsx';
import { Card } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Label } from '../../components/ui/label.jsx';
import { Textarea } from '../../components/ui/textarea.jsx';
import { Input } from '../../components/ui/input.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.jsx';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.jsx';
import { EmptyState, StarRating } from '../../components/StateViews.jsx';
import { ConfirmDialog } from '../../components/ConfirmDialog.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAppData } from '../../context/AppContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { formatDate, todayISO } from '../../utils/helpers.js';

const ScheduleClass = () => {
  const { auth } = useAuth();
  const { state, scheduleClass, cancelClass, addComment, pushToast } = useAppData();
  const { t } = useLanguage();
  const studentId = auth.studentId;
  const student = state.students.find((s) => s.id === studentId);

  const [bookOpen, setBookOpen] = useState(false);
  const [courseId, setCourseId] = useState('');
  const [instructorId, setInstructorId] = useState('');
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState('10:00');
  const [error, setError] = useState('');

  const [lateCancelTarget, setLateCancelTarget] = useState(null);
  const [commentModal, setCommentModal] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5);

  const myEnrolledCourseIds = state.enrollments.filter((e) => e.studentId === studentId).map((e) => e.courseId);
  const eligibleCourses = state.courses.filter((c) => myEnrolledCourseIds.includes(c.id));

  const instructorsForCourse = (cId) => {
    const course = state.courses.find((c) => c.id === cId);
    if (!course) return [];
    return state.instructors.filter((i) => i.active && i.categories.includes(course.category));
  };

  const openBook = () => {
    const firstCourse = eligibleCourses[0]?.id || '';
    setCourseId(firstCourse);
    setInstructorId(instructorsForCourse(firstCourse)[0]?.id || '');
    setDate(todayISO());
    setTime('10:00');
    setError('');
    setBookOpen(true);
  };

  const handleBook = (e) => {
    e.preventDefault();
    if (!courseId || !instructorId || !date || !time) { setError(t('scheduleClass.errFields')); return; }
    if (student && !student.active) { setError(t('scheduleClass.errSuspended')); return; }
    const result = scheduleClass(studentId, instructorId, courseId, date, time, null);
    if (result.ok) setBookOpen(false);
    else setError(t('scheduleClass.errConflict'));
  };

  const myClasses = state.classes.filter((c) => c.studentId === studentId).sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  const hasCommented = (classId) => state.comments.some((c) => c.classId === classId);

  const handleCancel = (cls) => {
    const result = cancelClass(cls.id);
    if (!result.ok && result.late) setLateCancelTarget(cls);
  };

  const confirmLateCancel = () => {
    cancelClass(lateCancelTarget.id, { lateOverride: true });
    pushToast(t('scheduleClass.lateCancelled'));
  };

  const openComment = (cls) => { setCommentModal(cls); setCommentText(''); setRating(5); };

  const submitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) { pushToast(t('scheduleClass.commentWriteFirst'), 'danger'); return; }
    const result = addComment(studentId, commentModal.id, commentText.trim(), rating);
    if (result.ok) setCommentModal(null);
  };

  return (
    <>
      <PageHeader
        title={t('scheduleClass.title')}
        subtitle={t('scheduleClass.subtitle')}
        action={<Button variant="accent" onClick={openBook} disabled={eligibleCourses.length === 0}>{t('scheduleClass.bookClass')}</Button>}
      />
      <div className="flex-1 space-y-5 p-6 md:p-8">
        {eligibleCourses.length === 0 && (
          <Card className="p-5"><p className="text-sm text-muted-foreground">{t('scheduleClass.needEnroll')}</p></Card>
        )}

        <Card>
          {myClasses.length === 0 ? (
            <EmptyState title={t('scheduleClass.empty')} hint={t('scheduleClass.emptyHint')} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('scheduleClass.date')}</TableHead>
                  <TableHead>{t('scheduleClass.course')}</TableHead>
                  <TableHead>{t('scheduleClass.instructor')}</TableHead>
                  <TableHead>{t('scheduleClass.status')}</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {myClasses.map((cls) => {
                  const course = state.courses.find((c) => c.id === cls.courseId);
                  const instructor = state.instructors.find((i) => i.id === cls.instructorId);
                  return (
                    <TableRow key={cls.id}>
                      <TableCell>{formatDate(cls.date)} · {cls.time}</TableCell>
                      <TableCell>{course?.name}</TableCell>
                      <TableCell>{instructor?.name}</TableCell>
                      <TableCell>
                        <Badge variant={cls.status === 'completed' ? 'success' : cls.status === 'cancelled' ? 'destructive' : 'primary'}>
                          {t(`common.${cls.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1.5">
                          {cls.status === 'scheduled' && (
                            <Button variant="outline" size="sm" onClick={() => handleCancel(cls)}>{t('scheduleClass.cancel')}</Button>
                          )}
                          {cls.status === 'completed' && !hasCommented(cls.id) && (
                            <Button variant="outline" size="sm" onClick={() => openComment(cls)}>{t('scheduleClass.leaveComment')}</Button>
                          )}
                          {cls.status === 'completed' && hasCommented(cls.id) && (
                            <span className="text-xs text-muted-foreground">{t('scheduleClass.commentSubmitted')}</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>

      <Dialog open={bookOpen} onOpenChange={setBookOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t('scheduleClass.bookTitle')}</DialogTitle></DialogHeader>
          <form className="grid gap-4 px-6 py-4" onSubmit={handleBook}>
            <div className="flex flex-col gap-1.5">
              <Label>{t('scheduleClass.course')}</Label>
              <Select value={courseId} onValueChange={(v) => { setCourseId(v); setInstructorId(instructorsForCourse(v)[0]?.id || ''); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {eligibleCourses.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t('scheduleClass.instructor')}</Label>
              <Select value={instructorId} onValueChange={setInstructorId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {instructorsForCourse(courseId).map((i) => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {instructorsForCourse(courseId).length === 0 && <span className="text-[11px] text-muted-foreground">{t('scheduleClass.noInstructorCovering')}</span>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>{t('scheduleClass.date')}</Label>
                <Input type="date" min={todayISO()} value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Time</Label>
                <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
            </div>
            {error && <span className="text-xs text-destructive">{error}</span>}
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleBook}>{t('scheduleClass.bookBtn')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {lateCancelTarget && (
        <ConfirmDialog
          open={!!lateCancelTarget}
          onOpenChange={(v) => !v && setLateCancelTarget(null)}
          title={t('scheduleClass.lateTitle')}
          message={t('scheduleClass.lateMsg')}
          confirmLabel={t('scheduleClass.cancel')}
          onConfirm={confirmLateCancel}
        />
      )}

      <Dialog open={!!commentModal} onOpenChange={(v) => !v && setCommentModal(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t('scheduleClass.commentTitle')}</DialogTitle></DialogHeader>
          <form className="flex flex-col gap-4 px-6 py-4" onSubmit={submitComment}>
            <div className="flex flex-col gap-1.5">
              <Label>{t('scheduleClass.rating')}</Label>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t('scheduleClass.commentLabel')}</Label>
              <Textarea rows={4} value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder={t('scheduleClass.commentPlaceholder')} />
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCommentModal(null)}>{t('common.cancel')}</Button>
            <Button onClick={submitComment}>{t('scheduleClass.postComment')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScheduleClass;
