import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

const DangerZoneTab = () => {
  const { employee } = useAuth();
  const companyName = employee?.company_name || '';
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleConfirm = () => {
    toast.info('This feature is coming soon');
    setOpen(false);
    setConfirmText('');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div
        className="rounded-[14px] border-2 p-6"
        style={{ borderColor: 'hsl(var(--destructive) / 0.4)', background: 'hsl(var(--card))' }}
      >
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[16px] font-semibold text-destructive mb-1" style={{ fontFamily: 'var(--ff-display)' }}>
              Irreversible Actions
            </h3>
            <p className="text-[13px] text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>
              These actions cannot be undone. Please proceed with extreme caution.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: 'hsl(var(--destructive) / 0.2)' }}>
          <div>
            <p className="text-[14px] font-medium text-foreground" style={{ fontFamily: 'var(--ff-body)' }}>
              Reset Company Data
            </p>
            <p className="text-[12px] text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>
              Delete all employee records, attendance data, payroll, and other company data.
            </p>
          </div>
          <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
            Reset Data
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) setConfirmText(''); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Reset Company Data</DialogTitle>
            <DialogDescription>
              This will permanently delete all company data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label className="text-[13px]">
              Type <strong>{companyName}</strong> to confirm
            </Label>
            <Input
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              placeholder={companyName}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setOpen(false); setConfirmText(''); }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={confirmText !== companyName}
              onClick={handleConfirm}
            >
              Reset All Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DangerZoneTab;
