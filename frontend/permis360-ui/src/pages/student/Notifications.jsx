import { PageHeader } from '../../components/PageHeader.jsx';
import { Card } from '../../components/ui/card.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { EmptyState } from '../../components/StateViews.jsx';
import { cn } from '../../lib/utils.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAppData } from '../../context/AppContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { formatDate } from '../../utils/helpers.js';

const Notifications = () => {
  const { auth } = useAuth();
  const { state, markNotificationRead } = useAppData();
  const { t } = useLanguage();
  const mine = state.notifications.filter((n) => n.studentId === auth.studentId).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHeader title={t('notifications.title')} subtitle={t('notifications.subtitleStudent')} />
      <div className="flex-1 p-6 md:p-8">
        <Card>
          {mine.length === 0 ? (
            <EmptyState title={t('notifications.emptyStudent')} hint={t('notifications.emptyStudentHint')} />
          ) : (
            <div className="flex flex-col gap-2 p-4">
              {mine.map((n) => (
                <div
                  key={n.id}
                  className={cn('flex cursor-pointer items-center justify-between gap-3 rounded-md border p-3', !n.read && 'bg-primary-soft')}
                  onClick={() => !n.read && markNotificationRead(n.id)}
                >
                  <div>
                    <p className="text-sm">{n.message}</p>
                    <span className="text-[11px] text-muted-foreground">{formatDate(n.date)} · {n.type}</span>
                  </div>
                  {!n.read && <Badge variant="accent">{t('notifications.new')}</Badge>}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

export default Notifications;
