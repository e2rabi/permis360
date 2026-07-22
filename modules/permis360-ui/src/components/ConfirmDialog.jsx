import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog.jsx';
import { Button } from './ui/button.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export const ConfirmDialog = ({ open, onOpenChange, title, message, confirmLabel, tone = 'destructive', onConfirm }) => {
  const { t } = useLanguage();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4">
          <p className="text-sm leading-relaxed text-muted-foreground">{message}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('common.cancel')}</Button>
          <Button
            variant={tone === 'destructive' ? 'destructive' : 'default'}
            onClick={() => { onConfirm(); onOpenChange(false); }}
          >
            {confirmLabel || t('common.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
