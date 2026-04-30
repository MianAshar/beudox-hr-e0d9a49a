// TODO: Remove before production
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Props {
  onCleared?: () => void;
}

const ClearLeaveDataButton = ({ onCleared }: Props) => {
  const { employee } = useAuth();
  const companyId = employee?.company_id;
  const roles = employee?.roles ?? [];
  const isCeo = roles.includes('ceo');

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isCeo) return null;

  const reset = () => {
    setStep(1);
    setConfirmText('');
    setLoading(false);
  };

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) reset();
  };

  const handleClear = async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const { error: delErr } = await supabase
        .from('leave_requests')
        .delete()
        .eq('company_id', companyId);
      if (delErr) throw delErr;

      const currentYear = new Date().getFullYear();
      const { error: updErr } = await supabase
        .from('leave_balances')
        .update({ used_days: 0 })
        .eq('company_id', companyId)
        .eq('year', currentYear);
      if (updErr) throw updErr;

      toast.success('All leave data cleared successfully.');
      handleOpenChange(false);
      onCleared?.();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to clear leave data');
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center px-3 h-9 text-[13px] font-medium bg-white transition-colors hover:bg-red-50"
        style={{
          color: '#991B1B',
          border: '1px solid rgba(232, 69, 69, 0.3)',
          borderRadius: 10,
        }}
      >
        Clear Leave Data
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          {step === 1 ? (
            <>
              <DialogHeader>
                <DialogTitle>Clear All Leave Data?</DialogTitle>
                <DialogDescription>
                  This will permanently delete ALL leave requests and reset all leave balances to zero for your company. This cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => handleOpenChange(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={() => setStep(2)}>
                  Yes, Delete
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Type DELETE to confirm</DialogTitle>
                <DialogDescription>
                  Please type <span className="font-mono font-semibold">DELETE</span> to permanently clear all leave data.
                </DialogDescription>
              </DialogHeader>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                autoFocus
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleClear}
                  disabled={confirmText !== 'DELETE' || loading}
                >
                  {loading ? 'Clearing…' : 'Clear Leave Data'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClearLeaveDataButton;
