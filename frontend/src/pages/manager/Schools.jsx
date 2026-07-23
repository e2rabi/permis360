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
import { makeId } from '../../utils/helpers.js';

const emptyForm = { name: '', address: '', city: '', phone: '', agrement: '' };

const Schools = () => {
  const { t } = useLanguage();
  const { state, addItem, updateItem, deleteItem, pushToast } = useAppData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [confirmDeactivate, setConfirmDeactivate] = useState(null);

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setError(''); setModalOpen(true); };

  const openEdit = (school) => {
    setEditingId(school.id);
    setForm({ name: school.name, address: school.address, city: school.city, phone: school.phone, agrement: school.agrement });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.agrement.trim()) { setError(t('schools.errRequired')); return; }
    const duplicate = state.schools.some((s) => s.agrement.toLowerCase() === form.agrement.trim().toLowerCase() && s.id !== editingId);
    if (duplicate) { setError(t('schools.errDuplicate')); return; }
    if (editingId) {
      updateItem('schools', editingId, form);
      pushToast(t('schools.updated'), 'success');
    } else {
      addItem('schools', { id: makeId('sch'), ...form, active: true });
      pushToast(t('schools.created'), 'success');
    }
    setModalOpen(false);
  };

  const hasDependents = (id) => state.courses.some((c) => c.schoolId === id);

  const handleDelete = (school) => {
    if (hasDependents(school.id)) { setConfirmDeactivate(school); return; }
    deleteItem('schools', school.id);
    pushToast(t('schools.removed'));
  };

  return (
    <>
      <PageHeader
        title={t('schools.title')}
        subtitle={t('schools.subtitle')}
        action={<Button variant="accent" onClick={openCreate}>{t('schools.newSchool')}</Button>}
      />
      <div className="flex-1 p-6 md:p-8">
        <Card>
          {state.schools.length === 0 ? (
            <EmptyState title={t('schools.empty')} hint={t('schools.emptyHint')} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common.name')}</TableHead>
                  <TableHead>{t('schools.city')}</TableHead>
                  <TableHead>{t('schools.agrement')}</TableHead>
                  <TableHead>{t('common.phone')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.schools.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-semibold">{s.name}</TableCell>
                    <TableCell>{s.city}</TableCell>
                    <TableCell className="font-mono text-xs">{s.agrement}</TableCell>
                    <TableCell>{s.phone}</TableCell>
                    <TableCell><Badge variant={s.active ? 'success' : 'neutral'}>{s.active ? t('common.active') : t('common.archived')}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1.5">
                        <Button variant="outline" size="sm" onClick={() => openEdit(s)}>{t('common.edit')}</Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(s)}>
                          {hasDependents(s.id) ? t('schools.archive') : t('common.delete')}
                        </Button>
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
          <DialogHeader><DialogTitle>{editingId ? t('schools.editSchool') : t('schools.newSchool').replace('+ ', '')}</DialogTitle></DialogHeader>
          <form className="grid gap-4 px-6 py-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 col-span-2">
                <Label>{t('schools.name')}</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Auto-École ..." />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('schools.agrement')}</Label>
                <Input value={form.agrement} onChange={(e) => setForm({ ...form, agrement: e.target.value })} placeholder="AG-CAS-2024-0001" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('schools.city')}</Label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Casablanca" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('common.phone')}</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0522-00-00-00" />
              </div>
              <div className="flex flex-col gap-1.5 col-span-2">
                <Label>{t('common.address')}</Label>
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
            </div>
            {error && <span className="text-xs text-destructive">{error}</span>}
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleSubmit}>{editingId ? t('common.save') : t('common.create')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {confirmDeactivate && (
        <ConfirmDialog
          open={!!confirmDeactivate}
          onOpenChange={(v) => !v && setConfirmDeactivate(null)}
          title={t('schools.archiveTitle')}
          message={`"${confirmDeactivate.name}" ${t('schools.archiveMsg')}`}
          confirmLabel={t('schools.archiveConfirm')}
          tone="default"
          onConfirm={() => { updateItem('schools', confirmDeactivate.id, { active: false }); pushToast(t('schools.archived')); }}
        />
      )}
    </>
  );
};

export default Schools;
