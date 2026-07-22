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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs.jsx';
import { EmptyState } from '../../components/StateViews.jsx';
import { useAppData } from '../../context/AppContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { formatDate, makeId, PERMIT_CATEGORIES, todayISO, addDays } from '../../utils/helpers.js';

const emptyCarForm = { plate: '', brand: '', model: '', transmission: 'Manual', category: 'B' };
const emptyAssignForm = { carId: '', instructorId: '', from: todayISO(), to: addDays(todayISO(), 30) };

const Cars = () => {
  const { t } = useLanguage();
  const { state, addItem, updateItem, deleteItem, assignCarToInstructor, pushToast } = useAppData();
  const [tab, setTab] = useState('fleet');

  const [carModalOpen, setCarModalOpen] = useState(false);
  const [editingCarId, setEditingCarId] = useState(null);
  const [carForm, setCarForm] = useState(emptyCarForm);
  const [carError, setCarError] = useState('');

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignForm, setAssignForm] = useState(emptyAssignForm);
  const [assignError, setAssignError] = useState('');

  const currentAssignment = (carId) => {
    const today = todayISO();
    return state.carAssignments.find((a) => a.carId === carId && a.from <= today && today <= a.to);
  };

  const openCreateCar = () => { setEditingCarId(null); setCarForm(emptyCarForm); setCarError(''); setCarModalOpen(true); };

  const openEditCar = (car) => {
    setEditingCarId(car.id);
    setCarForm({ plate: car.plate, brand: car.brand, model: car.model, transmission: car.transmission, category: car.category });
    setCarError('');
    setCarModalOpen(true);
  };

  const handleCarSubmit = (e) => {
    e.preventDefault();
    if (!carForm.plate.trim() || !carForm.brand.trim()) { setCarError(t('cars.errRequired')); return; }
    const duplicate = state.cars.some((c) => c.plate.toLowerCase() === carForm.plate.trim().toLowerCase() && c.id !== editingCarId);
    if (duplicate) { setCarError(t('cars.errDuplicate')); return; }
    if (editingCarId) {
      updateItem('cars', editingCarId, carForm);
      pushToast(t('cars.updated'), 'success');
    } else {
      addItem('cars', { id: makeId('car'), ...carForm, status: 'available' });
      pushToast(t('cars.created'), 'success');
    }
    setCarModalOpen(false);
  };

  const toggleMaintenance = (car) => {
    const next = car.status === 'available' ? 'maintenance' : 'available';
    updateItem('cars', car.id, { status: next });
    pushToast(`${t('cars.markedStatus')} ${next === 'available' ? t('cars.available') : t('cars.maintenance')}.`);
    if (next === 'maintenance') {
      const upcoming = state.sessions.filter((s) => s.carId === car.id && s.status === 'scheduled');
      if (upcoming.length > 0) pushToast(`${upcoming.length} ${t('cars.maintenanceWarn')}`, 'danger');
    }
  };

  const handleDeleteCar = (car) => {
    const upcoming = state.sessions.some((s) => s.carId === car.id && s.status === 'scheduled');
    if (upcoming) { pushToast(t('cars.cannotDelete'), 'danger'); return; }
    deleteItem('cars', car.id);
    pushToast(t('cars.deleted'));
  };

  const openAssign = (carId) => {
    setAssignForm({ ...emptyAssignForm, carId: carId || state.cars[0]?.id || '', instructorId: state.instructors[0]?.id || '' });
    setAssignError('');
    setAssignModalOpen(true);
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!assignForm.carId || !assignForm.instructorId) { setAssignError(t('cars.errSelect')); return; }
    if (assignForm.from > assignForm.to) { setAssignError(t('cars.errDateRange')); return; }
    const car = state.cars.find((c) => c.id === assignForm.carId);
    if (car?.status === 'maintenance') { setAssignError(t('cars.errMaintenance')); return; }
    const result = assignCarToInstructor(assignForm.carId, assignForm.instructorId, assignForm.from, assignForm.to);
    if (result.ok) setAssignModalOpen(false);
  };

  return (
    <>
      <PageHeader
        title={t('cars.title')}
        subtitle={t('cars.subtitle')}
        action={
          tab === 'fleet'
            ? <Button variant="accent" onClick={openCreateCar}>{t('cars.newCar')}</Button>
            : <Button variant="accent" onClick={() => openAssign()}>{t('cars.assignCar')}</Button>
        }
      />
      <div className="flex-1 p-6 md:p-8">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="fleet">{t('cars.fleetTab')}</TabsTrigger>
            <TabsTrigger value="assignments">{t('cars.assignmentsTab')}</TabsTrigger>
          </TabsList>

          <TabsContent value="fleet" className="mt-0">
            <Card>
              {state.cars.length === 0 ? (
                <EmptyState title={t('cars.empty')} hint={t('cars.emptyHint')} />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('cars.plate')}</TableHead>
                      <TableHead>{t('cars.vehicle')}</TableHead>
                      <TableHead>{t('cars.category')}</TableHead>
                      <TableHead>{t('cars.transmission')}</TableHead>
                      <TableHead>{t('cars.currentInstructor')}</TableHead>
                      <TableHead>{t('common.status')}</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.cars.map((c) => {
                      const assignment = currentAssignment(c.id);
                      const instructor = assignment && state.instructors.find((i) => i.id === assignment.instructorId);
                      return (
                        <TableRow key={c.id}>
                          <TableCell className="font-mono text-xs">{c.plate}</TableCell>
                          <TableCell>{c.brand} {c.model}</TableCell>
                          <TableCell>{c.category}</TableCell>
                          <TableCell>{c.transmission === 'Manual' ? t('cars.manual') : t('cars.automatic')}</TableCell>
                          <TableCell>{instructor ? instructor.name : '—'}</TableCell>
                          <TableCell><Badge variant={c.status === 'available' ? 'success' : 'destructive'}>{c.status === 'available' ? t('cars.available') : t('cars.maintenance')}</Badge></TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1.5">
                              <Button variant="outline" size="sm" onClick={() => openEditCar(c)}>{t('common.edit')}</Button>
                              <Button variant="outline" size="sm" onClick={() => openAssign(c.id)}>{t('cars.assign')}</Button>
                              <Button variant="outline" size="sm" onClick={() => toggleMaintenance(c)}>
                                {c.status === 'available' ? t('cars.sendToMaintenance') : t('cars.markAvailable')}
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteCar(c)}>{t('common.delete')}</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="mt-0">
            <Card>
              {state.carAssignments.length === 0 ? (
                <EmptyState title={t('cars.emptyAssignments')} hint={t('cars.emptyAssignmentsHint')} />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('cars.plate')}</TableHead>
                      <TableHead>{t('cars.currentInstructor')}</TableHead>
                      <TableHead>{t('cars.from')}</TableHead>
                      <TableHead>{t('cars.to')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...state.carAssignments].reverse().map((a) => {
                      const car = state.cars.find((c) => c.id === a.carId);
                      const instructor = state.instructors.find((i) => i.id === a.instructorId);
                      return (
                        <TableRow key={a.id}>
                          <TableCell className="font-mono text-xs">{car?.plate || '—'}</TableCell>
                          <TableCell>{instructor?.name || '—'}</TableCell>
                          <TableCell>{formatDate(a.from)}</TableCell>
                          <TableCell>{formatDate(a.to)}</TableCell>
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

      <Dialog open={carModalOpen} onOpenChange={setCarModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingCarId ? t('cars.editCar') : t('cars.newCar').replace('+ ', '')}</DialogTitle></DialogHeader>
          <form className="grid gap-4 px-6 py-4" onSubmit={handleCarSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>{t('cars.plate')}</Label>
                <Input value={carForm.plate} onChange={(e) => setCarForm({ ...carForm, plate: e.target.value })} placeholder="4521-A-12" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Brand</Label>
                <Input value={carForm.brand} onChange={(e) => setCarForm({ ...carForm, brand: e.target.value })} placeholder="Renault" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Model</Label>
                <Input value={carForm.model} onChange={(e) => setCarForm({ ...carForm, model: e.target.value })} placeholder="Clio" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('cars.transmission')}</Label>
                <Select value={carForm.transmission} onValueChange={(v) => setCarForm({ ...carForm, transmission: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manual">{t('cars.manual')}</SelectItem>
                    <SelectItem value="Automatic">{t('cars.automatic')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('cars.category')}</Label>
                <Select value={carForm.category} onValueChange={(v) => setCarForm({ ...carForm, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PERMIT_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {carError && <span className="text-xs text-destructive">{carError}</span>}
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCarModalOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleCarSubmit}>{editingCarId ? t('common.save') : t('cars.addCar')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t('cars.assignCarTitle')}</DialogTitle></DialogHeader>
          <form className="grid gap-4 px-6 py-4" onSubmit={handleAssignSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>{t('cars.title').split(' ')[0]}</Label>
                <Select value={assignForm.carId} onValueChange={(v) => setAssignForm({ ...assignForm, carId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {state.cars.map((c) => <SelectItem key={c.id} value={c.id}>{c.plate} — {c.brand} {c.model}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('cars.currentInstructor')}</Label>
                <Select value={assignForm.instructorId} onValueChange={(v) => setAssignForm({ ...assignForm, instructorId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {state.instructors.map((i) => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('cars.from')}</Label>
                <Input type="date" value={assignForm.from} onChange={(e) => setAssignForm({ ...assignForm, from: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('cars.to')}</Label>
                <Input type="date" value={assignForm.to} onChange={(e) => setAssignForm({ ...assignForm, to: e.target.value })} />
              </div>
            </div>
            {assignError && <span className="text-xs text-destructive">{assignError}</span>}
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignModalOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleAssignSubmit}>{t('cars.assign')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Cars;
