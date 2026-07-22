import { useState } from 'react';
import { PageHeader } from '../../components/PageHeader.jsx';
import { Card } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Input } from '../../components/ui/input.jsx';
import { Label } from '../../components/ui/label.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.jsx';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog.jsx';
import { EmptyState } from '../../components/StateViews.jsx';
import { ConfirmDialog } from '../../components/ConfirmDialog.jsx';
import { useAppData } from '../../context/AppContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { cn } from '../../lib/utils.js';
import { makeId, PERMIT_CATEGORIES } from '../../utils/helpers.js';

const emptyForm = { name: '', cin: '', phone: '', licenseNumber: '', categories: [] };

const Instructors = () => {
  const { t } = useLanguage();
  const { state, addItem, updateItem, deleteItem, pushToast } = useAppData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [confirmDeactivate, setConfirmDeactivate] = useState(null);

  const upcomingSessionsFor = (instructorId) =>
    state.sessions.filter((s) => s.instructorId === instructorId && s.status === 'scheduled').length +
    state.classes.filter((c) => c.instructorId === instructorId && c.status === 'scheduled').length;

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setError(''); setModalOpen(true); };

  const openEdit = (ins) => {
    setEditingId(ins.id);
    setForm({ name: ins.name, cin: ins.cin, phone: ins.phone, licenseNumber: ins.licenseNumber, categories: ins.categories });
    setError('');
    setModalOpen(true);
  };

  const toggleCategory = (cat) => {
    setForm((f) => ({ ...f, categories: f.categories.includes(cat) ? f.categories.filter((c) => c !== cat) : [...f.categories, cat] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.cin.trim() || !form.licenseNumber.trim()) { setError(t('instructors.errRequired')); return; }
    if (!/^MON-\d{4}-\d{3,6}$/.test(form.licenseNumber.trim())) { setError(t('instructors.errLicenseFormat')); return; }
    const duplicate = state.instructors.some((i) => (i.licenseNumber === form.licenseNumber || i.cin === form.cin) && i.id !== editingId);
    if (duplicate) { setError(t('instructors.errDuplicate')); return; }
    if (form.categories.length === 0) { setError(t('instructors.errCategory')); return; }
    if (editingId) {
      updateItem('instructors', editingId, form);
      pushToast(t('instructors.updated'), 'success');
    } else {
      addItem('instructors', { id: makeId('ins'), ...form, active: true });
      pushToast(t('instructors.registered'), 'success');
    }
    setModalOpen(false);
  };

  const handleDeactivate = (ins) => {
    const upcoming = upcomingSessionsFor(ins.id);
    if (upcoming > 0 && ins.active) { setConfirmDeactivate({ instructor: ins, upcoming }); return; }
    updateItem('instructors', ins.id, { active: !ins.active });
    pushToast(ins.active ? t('instructors.deactivated') : t('instructors.reactivatedMsg'));
  };

  return (
    <>
      <PageHeader
        title={t('instructors.title')}
        subtitle={t('instructors.subtitle')}
        action={<Button variant="accent" onClick={openCreate}>{t('instructors.newInstructor')}</Button>}
      />
      <div className="flex-1 p-6 md:p-8">
        <Card>
          {state.instructors.length === 0 ? (
            <EmptyState title={t('instructors.empty')} hint={t('instructors.emptyHint')} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common.name')}</TableHead>
                  <TableHead>{t('instructors.cin')}</TableHead>
                  <TableHead>{t('instructors.licenseNumber')}</TableHead>
                  <TableHead>{t('instructors.categoriesLabel')}</TableHead>
                  <TableHead>{t('common.phone')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.instructors.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-semibold">{i.name}</TableCell>
                    <TableCell className="font-mono text-xs">{i.cin}</TableCell>
                    <TableCell className="font-mono text-xs">{i.licenseNumber}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {i.categories.map((c) => <Badge key={c} variant="primary">{c}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell>{i.phone}</TableCell>
                    <TableCell><Badge variant={i.active ? 'success' : 'neutral'}>{i.active ? t('common.active') : t('common.inactive')}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1.5">
                        <Button variant="outline" size="sm" onClick={() => openEdit(i)}>{t('common.edit')}</Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeactivate(i)}>{i.active ? t('instructors.deactivate') : t('instructors.reactivate')}</Button>
                        <Button variant="outline" size="sm" onClick={() => deleteItem('instructors', i.id)}>{t('common.delete')}</Button>
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
          <DialogHeader><DialogTitle>{editingId ? t('instructors.editInstructor') : t('instructors.newInstructor').replace('+ ', '')}</DialogTitle></DialogHeader>
          <form className="grid gap-4 px-6 py-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>{t('instructors.fullName')}</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('instructors.cin')}</Label>
                <Input value={form.cin} onChange={(e) => setForm({ ...form, cin: e.target.value.toUpperCase() })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('common.phone')}</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('instructors.licenseNumber')}</Label>
                <Input value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value.toUpperCase() })} />
                <span className="text-[11px] text-muted-foreground">{t('instructors.licenseHint')}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t('instructors.categoriesLabel')}</Label>
              <div className="flex flex-wrap gap-1.5">
                {PERMIT_CATEGORIES.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    className={cn(
                      'rounded-md border px-3 py-1 text-xs font-semibold transition-colors',
                      form.categories.includes(cat) ? 'border-primary bg-primary text-primary-foreground' : 'border-input hover:bg-secondary'
                    )}
                    onClick={() => toggleCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            {error && <span className="text-xs text-destructive">{error}</span>}
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleSubmit}>{editingId ? t('common.save') : t('instructors.registerInstructor')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {confirmDeactivate && (
        <ConfirmDialog
          open={!!confirmDeactivate}
          onOpenChange={(v) => !v && setConfirmDeactivate(null)}
          title={t('instructors.confirmDeactivateTitle')}
          message={`${confirmDeactivate.instructor.name} ${t('instructors.confirmDeactivateMsg')}`}
          confirmLabel={t('instructors.deactivateAnyway')}
          onConfirm={() => updateItem('instructors', confirmDeactivate.instructor.id, { active: false })}
        />
      )}
    </>
  );
};

export default Instructors;
