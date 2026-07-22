import { useState } from 'react';
import { PageHeader } from '../../components/PageHeader.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Label } from '../../components/ui/label.jsx';
import { Textarea } from '../../components/ui/textarea.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.jsx';
import { EmptyState } from '../../components/StateViews.jsx';
import { useAppData } from '../../context/AppContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { formatDate } from '../../utils/helpers.js';

const Notifications = () => {
  const { t } = useLanguage();
  const { state, notifyStudent, pushToast } = useAppData();
  const [target, setTarget] = useState('all');
  const [studentId, setStudentId] = useState(state.students[0]?.id || '');
  const [message, setMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) { pushToast(t('notifications.writeFirst'), 'danger'); return; }
    if (target === 'all') {
      state.students.filter((s) => s.active).forEach((s) => notifyStudent(s.id, message.trim(), 'manual'));
    } else {
      notifyStudent(studentId, message.trim(), 'manual');
    }
    pushToast(t('notifications.sent'), 'success');
    setMessage('');
  };

  const sorted = [...state.notifications].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHeader title={t('notifications.title')} subtitle={t('notifications.subtitleManager')} />
      <div className="flex-1 space-y-6 p-6 md:p-8">
        <Card>
          <CardHeader><CardTitle>{t('notifications.send')}</CardTitle></CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={handleSend}>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>{t('notifications.recipients')}</Label>
                  <Select value={target} onValueChange={setTarget}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('notifications.allActive')}</SelectItem>
                      <SelectItem value="one">{t('notifications.singleStudent')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {target === 'one' && (
                  <div className="flex flex-col gap-1.5">
                    <Label>{t('notifications.student')}</Label>
                    <Select value={studentId} onValueChange={setStudentId}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {state.students.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t('notifications.message')}</Label>
                <Textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t('notifications.messagePlaceholder')} />
              </div>
              <div><Button type="submit">{t('notifications.sendBtn')}</Button></div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t('notifications.sentHistory')}</CardTitle></CardHeader>
          {sorted.length === 0 ? (
            <EmptyState title={t('notifications.empty')} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common.date')}</TableHead>
                  <TableHead>{t('notifications.student')}</TableHead>
                  <TableHead>{t('notifications.message')}</TableHead>
                  <TableHead>{t('notifications.type')}</TableHead>
                  <TableHead>{t('notifications.read')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((n) => {
                  const student = state.students.find((s) => s.id === n.studentId);
                  return (
                    <TableRow key={n.id}>
                      <TableCell>{formatDate(n.date)}</TableCell>
                      <TableCell>{student?.name || '—'}</TableCell>
                      <TableCell className="max-w-xs truncate">{n.message}</TableCell>
                      <TableCell className="capitalize">{n.type}</TableCell>
                      <TableCell>{n.read ? t('notifications.read') : t('notifications.unread')}</TableCell>
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

export default Notifications;
