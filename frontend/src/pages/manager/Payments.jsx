import { useMemo, useState } from 'react';
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
import { formatDate, formatMAD } from '../../utils/helpers.js';

const Payments = () => {
  const { t } = useLanguage();
  const { state, recordPayment } = useAppData();
  const [tab, setTab] = useState('overview');
  const [payModal, setPayModal] = useState(null);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('cash');
  const [error, setError] = useState('');

  const rows = useMemo(() => state.enrollments.map((e) => {
    const student = state.students.find((s) => s.id === e.studentId);
    const course = state.courses.find((c) => c.id === e.courseId);
    const paid = state.payments.filter((p) => p.studentId === e.studentId && p.courseId === e.courseId).reduce((s, p) => s + p.amount, 0);
    const remaining = Math.max(0, (course?.price || 0) - paid);
    return { enrollment: e, student, course, paid, remaining };
  }), [state.enrollments, state.students, state.courses, state.payments]);

  const overdue = rows.filter((r) => r.remaining > 0);

  const openPay = (row) => { setPayModal(row); setAmount(''); setMethod('cash'); setError(''); };

  const handlePay = (e) => {
    e.preventDefault();
    const amt = Number(amount);
    if (!amt || amt <= 0) { setError(t('payments.exceeds', { remaining: payModal.remaining })); return; }
    const result = recordPayment(payModal.student.id, payModal.course.id, amt, method);
    if (result.ok) setPayModal(null);
    else setError(t('payments.exceeds', { remaining: payModal.remaining }));
  };

  const renderTable = (list) => (
    list.length === 0 ? (
      <EmptyState title={t('payments.nothingToShow')} hint={t('payments.nothingHint')} />
    ) : (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('payments.student')}</TableHead>
            <TableHead>{t('payments.course')}</TableHead>
            <TableHead>{t('payments.price')}</TableHead>
            <TableHead>{t('payments.paid')}</TableHead>
            <TableHead>{t('payments.remaining')}</TableHead>
            <TableHead>{t('common.status')}</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((r) => (
            <TableRow key={r.enrollment.id}>
              <TableCell className="font-semibold">{r.student?.name}</TableCell>
              <TableCell>{r.course?.name}</TableCell>
              <TableCell>{formatMAD(r.course?.price)}</TableCell>
              <TableCell>{formatMAD(r.paid)}</TableCell>
              <TableCell>{formatMAD(r.remaining)}</TableCell>
              <TableCell>
                <Badge variant={r.remaining === 0 ? 'success' : r.paid > 0 ? 'accent' : 'destructive'}>
                  {r.remaining === 0 ? t('common.paid') : r.paid > 0 ? t('common.partial') : t('common.unpaid')}
                </Badge>
              </TableCell>
              <TableCell>
                {r.remaining > 0 && <Button variant="outline" size="sm" onClick={() => openPay(r)}>{t('payments.recordPayment')}</Button>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  );

  return (
    <>
      <PageHeader title={t('payments.title')} subtitle={t('payments.subtitleManager')} />
      <div className="flex-1 p-6 md:p-8">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">{t('payments.allStudents')}</TabsTrigger>
            <TabsTrigger value="overdue">{t('payments.overdue')} ({overdue.length})</TabsTrigger>
            <TabsTrigger value="history">{t('payments.history')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0"><Card>{renderTable(rows)}</Card></TabsContent>
          <TabsContent value="overdue" className="mt-0"><Card>{renderTable(overdue)}</Card></TabsContent>
          <TabsContent value="history" className="mt-0">
            <Card>
              {state.payments.length === 0 ? (
                <EmptyState title={t('payments.noHistory')} />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('common.date')}</TableHead>
                      <TableHead>{t('payments.student')}</TableHead>
                      <TableHead>{t('payments.course')}</TableHead>
                      <TableHead>{t('payments.amount')}</TableHead>
                      <TableHead>{t('payments.method')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...state.payments].reverse().map((p) => {
                      const student = state.students.find((s) => s.id === p.studentId);
                      const course = state.courses.find((c) => c.id === p.courseId);
                      return (
                        <TableRow key={p.id}>
                          <TableCell>{formatDate(p.date)}</TableCell>
                          <TableCell>{student?.name}</TableCell>
                          <TableCell>{course?.name}</TableCell>
                          <TableCell>{formatMAD(p.amount)}</TableCell>
                          <TableCell className="capitalize">{t(`payments.${p.method}`)}</TableCell>
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

      <Dialog open={!!payModal} onOpenChange={(v) => !v && setPayModal(null)}>
        <DialogContent>
          {payModal && (
            <>
              <DialogHeader><DialogTitle>{t('payments.recordPayment')} — {payModal.student?.name}</DialogTitle></DialogHeader>
              <form className="flex flex-col gap-4 px-6 py-4" onSubmit={handlePay}>
                <p className="text-sm text-muted-foreground">
                  {t('payments.remaining')}: <strong className="text-foreground">{formatMAD(payModal.remaining)}</strong> — {payModal.course?.name}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label>{t('payments.amount')}</Label>
                    <Input type="number" min="1" max={payModal.remaining} value={amount} onChange={(e) => setAmount(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>{t('payments.method')}</Label>
                    <Select value={method} onValueChange={setMethod}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">{t('payments.cash')}</SelectItem>
                        <SelectItem value="card">{t('payments.card')}</SelectItem>
                        <SelectItem value="transfer">{t('payments.transfer')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {error && <span className="text-xs text-destructive">{error}</span>}
              </form>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPayModal(null)}>{t('common.cancel')}</Button>
                <Button onClick={handlePay}>{t('payments.recordPayment')}</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Payments;
