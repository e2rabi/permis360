import { useState } from 'react';
import { PageHeader } from '../../components/PageHeader.jsx';
import { Card } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Input } from '../../components/ui/input.jsx';
import { Label } from '../../components/ui/label.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.jsx';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.jsx';
import { EmptyState, SeatMeter } from '../../components/StateViews.jsx';
import { ConfirmDialog } from '../../components/ConfirmDialog.jsx';
import { useAppData } from '../../context/AppContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { formatDate, makeId, todayISO } from '../../utils/helpers.js';

const emptyForm = { courseId: '', date: todayISO(), time: '09:00', room: '', instructorId: '', carId: '', seats: 10 };
const ROOM_CAPACITY = 20;

const Sessions = () => {
  const { t } = useLanguage();
  const { state, addItem, cancelSession, assignStudentToSession, removeStudentFromSession, pushToast } = useAppData();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [confirmCapacity, setConfirmCapacity] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [assignSessionId, setAssignSessionId] = useState(null);
  const [assignStudentId, setAssignStudentId] = useState('');

  const openCreate = () => {
    setForm({ ...emptyForm, courseId: state.courses[0]?.id || '', instructorId: state.instructors[0]?.id || '' });
    setError('');
    setModalOpen(true);
  };

  const commitCreate = () => {
    addItem('sessions', {
      id: makeId('ses'), courseId: form.courseId, date: form.date, time: form.time, room: form.room,
      instructorId: form.instructorId, carId: form.carId || null, seats: Number(form.seats),
      assignedStudentIds: [], status: 'scheduled',
    });
    pushToast(t('sessions.created'), 'success');
    setModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.courseId || !form.room.trim() || !form.instructorId) { setError(t('sessions.errRequired')); return; }
    if (Number(form.seats) <= 0) { setError(t('sessions.errSeats')); return; }
    if (Number(form.seats) > ROOM_CAPACITY) { setConfirmCapacity(true); return; }
    commitCreate();
  };

  const sessionForAssign = state.sessions.find((s) => s.id === assignSessionId);
  const eligibleStudents = sessionForAssign
    ? state.students.filter(
        (st) => st.active && !sessionForAssign.assignedStudentIds.includes(st.id) &&
          state.enrollments.some((e) => e.studentId === st.id && e.courseId === sessionForAssign.courseId && e.status === 'active')
      )
    : [];

  const handleAssign = () => {
    if (!assignStudentId) return;
    const result = assignStudentToSession(assignSessionId, assignStudentId);
    if (result.ok) setAssignStudentId('');
  };

  return (
    <>
      <PageHeader
        title={t('sessions.title')}
        subtitle={t('sessions.subtitle')}
        action={<Button variant="accent" onClick={openCreate}>{t('sessions.newSession')}</Button>}
      />
      <div className="flex-1 p-6 md:p-8">
        <Card>
          {state.sessions.length === 0 ? (
            <EmptyState title={t('sessions.empty')} hint={t('sessions.emptyHint')} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('dashboard.course')}</TableHead>
                  <TableHead>{t('common.date')}</TableHead>
                  <TableHead>{t('sessions.room')}</TableHead>
                  <TableHead>{t('sessions.instructor')}</TableHead>
                  <TableHead>{t('dashboard.seats')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.sessions.map((s) => {
                  const course = state.courses.find((c) => c.id === s.courseId);
                  const instructor = state.instructors.find((i) => i.id === s.instructorId);
                  return (
                    <TableRow key={s.id}>
                      <TableCell>{course?.name || '—'}</TableCell>
                      <TableCell>{formatDate(s.date)} · {s.time}</TableCell>
                      <TableCell>{s.room}</TableCell>
                      <TableCell>{instructor?.name || '—'}</TableCell>
                      <TableCell><SeatMeter used={s.assignedStudentIds.length} total={s.seats} /></TableCell>
                      <TableCell>
                        <Badge variant={s.status === 'scheduled' ? 'success' : s.status === 'cancelled' ? 'destructive' : 'neutral'}>
                          {t(`common.${s.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1.5">
                          <Button variant="outline" size="sm" onClick={() => setAssignSessionId(s.id)}>{t('sessions.manageRoster')}</Button>
                          {s.status === 'scheduled' && (
                            <Button variant="outline" size="sm" onClick={() => setConfirmCancel(s)}>{t('sessions.cancel')}</Button>
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

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t('sessions.newSession').replace('+ ', '')}</DialogTitle></DialogHeader>
          <form className="grid gap-4 px-6 py-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label>{t('dashboard.course')}</Label>
                <Select value={form.courseId} onValueChange={(v) => setForm({ ...form, courseId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {state.courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('sessions.date')}</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('sessions.time')}</Label>
                <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('sessions.room')}</Label>
                <Input value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} placeholder="Salle 1" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('sessions.instructor')}</Label>
                <Select value={form.instructorId} onValueChange={(v) => setForm({ ...form, instructorId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {state.instructors.map((i) => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('sessions.car')}</Label>
                <Select value={form.carId || '__none__'} onValueChange={(v) => setForm({ ...form, carId: v === '__none__' ? '' : v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">{t('sessions.none')}</SelectItem>
                    {state.cars.map((c) => <SelectItem key={c.id} value={c.id}>{c.plate}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('sessions.seatsCount')}</Label>
                <Input type="number" min="1" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} />
                <span className="text-[11px] text-muted-foreground">{t('sessions.capacityHint')}: {ROOM_CAPACITY}</span>
              </div>
            </div>
            {error && <span className="text-xs text-destructive">{error}</span>}
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleSubmit}>{t('sessions.createSession')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmCapacity}
        onOpenChange={setConfirmCapacity}
        title={t('sessions.capacityTitle')}
        message={t('sessions.capacityMsg', { seats: form.seats, capacity: ROOM_CAPACITY })}
        confirmLabel={t('sessions.createAnyway')}
        tone="default"
        onConfirm={commitCreate}
      />

      {confirmCancel && (
        <ConfirmDialog
          open={!!confirmCancel}
          onOpenChange={(v) => !v && setConfirmCancel(null)}
          title={t('sessions.cancelTitle')}
          message={t('sessions.cancelMsg', { count: confirmCancel.assignedStudentIds.length })}
          confirmLabel={t('sessions.cancelConfirm')}
          onConfirm={() => cancelSession(confirmCancel.id)}
        />
      )}

      <Dialog open={!!assignSessionId} onOpenChange={(v) => !v && setAssignSessionId(null)}>
        <DialogContent>
          {sessionForAssign && (
            <>
              <DialogHeader>
                <DialogTitle>{t('sessions.roster')} — {state.courses.find((c) => c.id === sessionForAssign.courseId)?.name || ''}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 px-6 py-4">
                <SeatMeter used={sessionForAssign.assignedStudentIds.length} total={sessionForAssign.seats} />

                <div className="flex flex-col gap-1.5">
                  <Label>{t('sessions.assignStudent')}</Label>
                  <div className="flex gap-2">
                    <Select value={assignStudentId} onValueChange={setAssignStudentId}>
                      <SelectTrigger className="flex-1"><SelectValue placeholder={t('sessions.selectStudent')} /></SelectTrigger>
                      <SelectContent>
                        {eligibleStudents.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={handleAssign} disabled={!assignStudentId}>{t('common.add')}</Button>
                  </div>
                  {eligibleStudents.length === 0 && <span className="text-[11px] text-muted-foreground">{t('sessions.noEligible')}</span>}
                </div>

                <Table>
                  <TableHeader><TableRow><TableHead>{t('sessions.student')}</TableHead><TableHead /></TableRow></TableHeader>
                  <TableBody>
                    {sessionForAssign.assignedStudentIds.map((sid) => {
                      const student = state.students.find((s) => s.id === sid);
                      return (
                        <TableRow key={sid}>
                          <TableCell>{student?.name || sid}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => removeStudentFromSession(sessionForAssign.id, sid)}>{t('common.remove')}</Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {sessionForAssign.assignedStudentIds.length === 0 && (
                      <TableRow><TableCell colSpan={2} className="text-muted-foreground">{t('sessions.noneAssigned')}</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAssignSessionId(null)}>{t('common.close')}</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Sessions;
