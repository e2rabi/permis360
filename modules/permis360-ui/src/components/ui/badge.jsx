import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils.js';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
  {
    variants: {
      variant: {
        neutral: 'bg-secondary text-muted-foreground',
        primary: 'bg-primary-soft text-primary',
        accent: 'bg-accent-soft text-accent',
        success: 'bg-success-soft text-success',
        destructive: 'bg-destructive-soft text-destructive',
      },
    },
    defaultVariants: { variant: 'neutral' },
  }
);

export const Badge = ({ className, variant, ...props }) => (
  <span className={cn(badgeVariants({ variant, className }))} {...props} />
);
