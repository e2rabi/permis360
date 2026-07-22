import { useState } from 'react';
import { PageHeader } from '../../components/PageHeader.jsx';
import { Card } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Input } from '../../components/ui/input.jsx';
import { Label } from '../../components/ui/label.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { Checkbox } from '../../components/ui/checkbox.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.jsx';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog.jsx';
import { EmptyState } from '../../components/StateViews.jsx';
import { useAppData } from '../../context/AppContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { calcAge, makeId } from '../../utils/helpers.js';

const emptyForm = { name: '', cin: '', dob: '', phone: '', address: '', guardianConsent: false };

const Students = () => {
  const { t } = useLanguage();
  const { state, addItem, updateItem, deleteItem, pushToast } = useAppData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setError(''); setModalOpen(true); };

  const openEdit = (student) => {
    setEditingId(student.id);
    setForm({ name: student.name, cin: student.cin, dob: student.dob, phone: student.phone, address: student.address, guardianConsent: student.guardianConsent });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.cin.trim() || !form.dob) { setError(t('students.errRequired')); return; }
    const duplicate = state.students.some((s) => s.cin === form.cin && s.id !== editingId);
    if (duplicate) { setError(t('students.errDuplicate')); return; }
    const age = calcAge(form.dob);
    if (age < 16) { setError(t('students.errMinAge')); return; }
    if (age < 18 && !form.guardianConsent) { setError(t('students.errConsent')); return; }
    if (editingId) {
      updateItem('students', editingId, form);
      pushToast(t('students.updated'), 'success');
    } else {
      addItem('students', { id: makeId('stu'), ...form, active: true });
      pushToast(t('students.registered'), 'success');
    }
    setModalOpen(false);
  };

  const toggleActive = (student) => {
    updateItem('students', student.id, { active: !student.active });
    pushToast(student.active ? t('students.suspendedMsg') : t('students.reactivatedMsg'));
  };

  return (
    <>
      <PageHeader
        title={t('students.title')}
        subtitle={t('students.subtitle')}
        action={<Button variant="accent" onClick={openCreate}>{t('students.newStudent')}</Button>}
      />
      <div className="flex-1 p-6 md:p-8">
        <Card>
          {state.students.length === 0 ? (
            <EmptyState title={t('students.empty')} hint={t('students.emptyHint')} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common.name')}</TableHead>
                  <TableHead>{t('students.cin')}</TableHead>
                  <TableHead>{t('students.age')}</TableHead>
                  <TableHead>{t('common.phone')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.students.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-semibold">{s.name}</TableCell>
                    <TableCell className="font-mono text-xs">{s.cin}</TableCell>
                    <TableCell>{calcAge(s.dob)}</TableCell>
                    <TableCell>{s.phone}</TableCell>
                    <TableCell><Badge variant={s.active ? 'success' : 'destructive'}>{s.active ? t('common.active') : t('common.suspended')}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1.5">
                        <Button variant="outline" size="sm" onClick={() => openEdit(s)}>{t('common.edit')}</Button>
                        <Button variant="outline" size="sm" onClick={() => toggleActive(s)}>{s.active ? t('students.suspend') : t('students.reactivate')}</Button>
                        <Button variant="outline" size="sm" onClick={() => deleteItem('students', s.id)}>{t('common.delete')}</Button>
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
          <DialogHeader><DialogTitle>{editingId ? t('students.editStudent') : t('students.newStudent').replace('+ ', '')}</DialogTitle></DialogHeader>
          <form className="grid gap-4 px-6 py-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>{t('students.fullName')}</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('students.cin')}</Label>
                <Input value={form.cin} onChange={(e) => setForm({ ...form, cin: e.target.value.toUpperCase() })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('students.dob')}</Label>
                <Input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('common.phone')}</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label>{t('common.address')}</Label>
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
            </div>
            {form.dob && calcAge(form.dob) < 18 && (
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={form.guardianConsent} onCheckedChange={(v) => setForm({ ...form, guardianConsent: !!v })} />
                {t('students.guardianConsent')}
              </label>
            )}
            {error && <span className="text-xs text-destructive">{error}</span>}
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleSubmit}>{editingId ? t('common.save') : t('students.registerStudent')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Students;
