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
import { EmptyState } from '../../components/StateViews.jsx';
import { ConfirmDialog } from '../../components/ConfirmDialog.jsx';
import { useAppData } from '../../context/AppContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { formatDate, formatMAD, makeId, PERMIT_CATEGORIES, todayISO } from '../../utils/helpers.js';

const emptyForm = {
  schoolId: '', name: '', category: 'B', theoryHours: 20, practiceHours: 20,
  price: 3000, startDate: todayISO(), paymentType: 'full', installments: 1,
};

const Courses = () => {
  const { t } = useLanguage();
  const { state, addItem, updateItem, deleteItem, pushToast } = useAppData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [warnEdit, setWarnEdit] = useState(false);

  const enrolledCount = (courseId) => state.enrollments.filter((e) => e.courseId === courseId && e.status === 'active').length;

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, schoolId: state.schools[0]?.id || '' });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (course) => {
    setEditingId(course.id);
    setForm({
      schoolId: course.schoolId, name: course.name, category: course.category,
      theoryHours: course.theoryHours, practiceHours: course.practiceHours, price: course.price,
      startDate: course.startDate, paymentType: course.paymentPlan.type, installments: course.paymentPlan.installments,
    });
    setError('');
    setModalOpen(true);
  };

  const buildPayload = () => ({
    schoolId: form.schoolId, name: form.name, category: form.category,
    theoryHours: Number(form.theoryHours), practiceHours: Number(form.practiceHours),
    price: Number(form.price), startDate: form.startDate,
    paymentPlan: { type: form.paymentType, installments: form.paymentType === 'installments' ? Number(form.installments) : 1 },
  });

  const commitSave = () => {
    if (editingId) {
      updateItem('courses', editingId, buildPayload());
      pushToast(t('courses.updated'), 'success');
    } else {
      addItem('courses', { id: makeId('crs'), status: 'open', ...buildPayload() });
      pushToast(t('courses.created'), 'success');
    }
    setModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.schoolId) { setError(t('courses.errRequired')); return; }
    if (Number(form.price) <= 0) { setError(t('courses.errPrice')); return; }
    if (editingId && enrolledCount(editingId) > 0) { setWarnEdit(true); return; }
    commitSave();
  };

  const toggleStatus = (course) => {
    updateItem('courses', course.id, { status: course.status === 'open' ? 'closed' : 'open' });
    pushToast(`${t('courses.statusChanged')} ${course.status === 'open' ? t('common.closed') : t('common.open')}.`);
  };

  const handleDelete = (course) => {
    if (enrolledCount(course.id) > 0) { pushToast(t('courses.cannotDelete'), 'danger'); return; }
    deleteItem('courses', course.id);
    pushToast(t('courses.deleted'));
  };

  return (
    <>
      <PageHeader
        title={t('courses.title')}
        subtitle={t('courses.subtitle')}
        action={<Button variant="accent" onClick={openCreate}>{t('courses.newCourse')}</Button>}
      />
      <div className="flex-1 p-6 md:p-8">
        <Card>
          {state.courses.length === 0 ? (
            <EmptyState title={t('courses.empty')} hint={t('courses.emptyHint')} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('courses.name')}</TableHead>
                  <TableHead>{t('courses.category')}</TableHead>
                  <TableHead>{t('courses.hours')}</TableHead>
                  <TableHead>{t('courses.price')}</TableHead>
                  <TableHead>{t('courses.startDate')}</TableHead>
                  <TableHead>{t('courses.enrolled')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.courses.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-semibold">{c.name}</TableCell>
                    <TableCell><Badge variant="primary">{c.category}</Badge></TableCell>
                    <TableCell>{c.theoryHours}h / {c.practiceHours}h</TableCell>
                    <TableCell>{formatMAD(c.price)}</TableCell>
                    <TableCell>{formatDate(c.startDate)}</TableCell>
                    <TableCell>{enrolledCount(c.id)}</TableCell>
                    <TableCell><Badge variant={c.status === 'open' ? 'success' : 'neutral'}>{c.status === 'open' ? t('common.open') : t('common.closed')}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1.5">
                        <Button variant="outline" size="sm" onClick={() => openEdit(c)}>{t('common.edit')}</Button>
                        <Button variant="outline" size="sm" onClick={() => toggleStatus(c)}>{c.status === 'open' ? t('courses.close') : t('courses.reopen')}</Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(c)}>{t('common.delete')}</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? t('courses.editCourse') : t('courses.newCourse').replace('+ ', '')}</DialogTitle></DialogHeader>
          <form className="grid gap-4 px-6 py-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label>{t('courses.name')}</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('courses.school')}</Label>
                <Select value={form.schoolId} onValueChange={(v) => setForm({ ...form, schoolId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {state.schools.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('courses.category')}</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PERMIT_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('courses.theoryHours')}</Label>
                <Input type="number" min="0" value={form.theoryHours} onChange={(e) => setForm({ ...form, theoryHours: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('courses.practiceHours')}</Label>
                <Input type="number" min="0" value={form.practiceHours} onChange={(e) => setForm({ ...form, practiceHours: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('courses.price')}</Label>
                <Input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('courses.startDate')}</Label>
                <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('courses.paymentPlan')}</Label>
                <Select value={form.paymentType} onValueChange={(v) => setForm({ ...form, paymentType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">{t('courses.full')}</SelectItem>
                    <SelectItem value="installments">{t('courses.installments')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.paymentType === 'installments' && (
                <div className="flex flex-col gap-1.5">
                  <Label>{t('courses.installmentsCount')}</Label>
                  <Input type="number" min="2" max="12" value={form.installments} onChange={(e) => setForm({ ...form, installments: e.target.value })} />
                </div>
              )}
            </div>
            {error && <span className="text-xs text-destructive">{error}</span>}
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleSubmit}>{editingId ? t('common.save') : t('courses.createCourse')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={warnEdit}
        onOpenChange={setWarnEdit}
        title={t('courses.warnEditTitle')}
        message={t('courses.warnEditMsg')}
        confirmLabel={t('courses.saveAnyway')}
        tone="default"
        onConfirm={commitSave}
      />
    </>
  );
};

export default Courses;
