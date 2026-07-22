import { useState } from 'react';
import { PageHeader } from '../../components/PageHeader.jsx';
import { Card } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Input } from '../../components/ui/input.jsx';
import { Label } from '../../components/ui/label.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAppData } from '../../context/AppContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { calcAge, formatDate } from '../../utils/helpers.js';

const Profile = () => {
  const { auth } = useAuth();
  const { state, updateItem, pushToast } = useAppData();
  const { t } = useLanguage();
  const student = state.students.find((s) => s.id === auth.studentId);
  const [editOpen, setEditOpen] = useState(false);
  const [phone, setPhone] = useState(student?.phone || '');
  const [address, setAddress] = useState(student?.address || '');

  if (!student) return null;

  const enrollments = state.enrollments.filter((e) => e.studentId === student.id);

  const submitUpdate = (e) => {
    e.preventDefault();
    updateItem('students', student.id, { pendingUpdate: { phone, address, requestedAt: new Date().toISOString() } });
    pushToast(t('profile.requestSent'), 'success');
    setEditOpen(false);
  };

  return (
    <>
      <PageHeader title={t('profile.title')} subtitle={t('profile.subtitle')} />
      <div className="flex-1 p-6 md:p-8">
        <Card className="max-w-2xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold">{student.name}</h2>
              <span className="font-mono text-xs text-muted-foreground">{student.cin}</span>
            </div>
            <Badge variant={student.active ? 'success' : 'destructive'}>{student.active ? t('common.active') : t('common.suspended')}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><div className="text-xs font-semibold text-muted-foreground">{t('profile.dob')}</div><p className="mt-1">{formatDate(student.dob)} ({calcAge(student.dob)})</p></div>
            <div><div className="text-xs font-semibold text-muted-foreground">{t('profile.phone')}</div><p className="mt-1">{student.phone}</p></div>
            <div className="col-span-2"><div className="text-xs font-semibold text-muted-foreground">{t('profile.address')}</div><p className="mt-1">{student.address}</p></div>
            <div><div className="text-xs font-semibold text-muted-foreground">{t('profile.coursesEnrolled')}</div><p className="mt-1">{enrollments.length}</p></div>
          </div>

          {student.pendingUpdate && (
            <div className="mt-4 text-xs font-medium text-accent">{t('profile.pending')}</div>
          )}

          <div className="mt-5">
            <Button variant="outline" onClick={() => setEditOpen(true)}>{t('profile.requestUpdate')}</Button>
          </div>
        </Card>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t('profile.requestTitle')}</DialogTitle></DialogHeader>
          <form className="flex flex-col gap-4 px-6 py-4" onSubmit={submitUpdate}>
            <div className="flex flex-col gap-1.5">
              <Label>{t('profile.phone')}</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t('profile.address')}</Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <span className="text-[11.5px] text-muted-foreground">{t('profile.requestHint')}</span>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={submitUpdate}>{t('profile.sendRequest')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Profile;
