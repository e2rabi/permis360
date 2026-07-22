import { Inbox } from 'lucide-react';

export const EmptyState = ({ title, hint }) => (
  <div className="flex flex-col items-center gap-2 px-6 py-14 text-center text-muted-foreground">
    <Inbox className="mb-1 h-7 w-7 opacity-50" />
    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    {hint && <p className="max-w-sm text-xs leading-relaxed">{hint}</p>}
  </div>
);

export const SeatMeter = ({ used, total, label }) => {
  const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <span>{used}/{total}{label ? ` ${label}` : ''}</span>
    </div>
  );
};

export const StarRating = ({ value, onChange }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        type="button"
        key={n}
        className="rounded p-1 text-lg leading-none text-accent transition-transform hover:scale-110"
        onClick={() => onChange?.(n)}
        aria-label={`${n}`}
        disabled={!onChange}
      >
        {n <= value ? '★' : '☆'}
      </button>
    ))}
  </div>
);
