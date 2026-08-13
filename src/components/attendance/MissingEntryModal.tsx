import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export interface MissingEntryTarget {
  recordId: string;
  employeeId: string | null;
  employeeName?: string | null;
  employeeCode?: string | null;
  date: string; // YYYY-MM-DD
  field: 'check_in' | 'check_out' | 'both';
  existingCheckIn: string | null;
  existingCheckOut: string | null;
  /** 'insert' when no attendance_record exists yet for this day. */
  mode?: 'update' | 'insert';
}

interface Props {
  open: boolean;
  target: MissingEntryTarget | null;
  shiftStart: string; // HH:mm:ss
  shiftEnd: string;   // HH:mm:ss
  shiftDuration: number; // hours
  lateThresholdMin: number;
  lunchBreakHours: number;
  onClose: () => void;
  onSaved: () => void;
}

function parseTimeToHours(t: string): number {
  const m = t.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return 0;
  return parseInt(m[1], 10) + parseInt(m[2], 10) / 60;
}

function buildIsoForDate(date: string, time12: string): string {
  // time12 from <input type="time"> is "HH:mm" (24h)
  const [h, m] = time12.split(':').map(n => parseInt(n, 10));
  // Build ISO string in Karachi offset +05:00
  const hh = String(h).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  return `${date}T${hh}:${mm}:00+05:00`;
}

export default function MissingEntryModal({
  open, target, shiftStart, shiftEnd, shiftDuration, lateThresholdMin, lunchBreakHours,
  onClose, onSaved,
}: Props) {
  const { employee } = useAuth();
  const [time, setTime] = useState('');
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);

  const isBoth = target?.field === 'both';
  const mode = target?.mode ?? 'update';

  const resetForm = () => {
    setTime('');
    setCheckInTime('');
    setCheckOutTime('');
    setReason('');
  };

  const handleClose = () => {
    if (saving) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!target || !employee?.company_id || !employee?.employee_id) return;

    if (isBoth) {
      if (!checkInTime || !checkOutTime) {
        toast.error('Please select both check-in and check-out times');
        return;
      }
      if (parseTimeToHours(checkOutTime) <= parseTimeToHours(checkInTime)) {
        toast.error('Check-out must be after check-in');
        return;
      }
    } else if (!time) {
      toast.error('Please select a time');
      return;
    }

    if (!reason.trim()) {
      toast.error('Reason is required');
      return;
    }

    setSaving(true);
    try {
      let newCheckIn: string | null;
      let newCheckOut: string | null;

      if (isBoth) {
        newCheckIn = buildIsoForDate(target.date, checkInTime);
        newCheckOut = buildIsoForDate(target.date, checkOutTime);
      } else {
        const newIso = buildIsoForDate(target.date, time);
        newCheckIn = target.field === 'check_in' ? newIso : target.existingCheckIn;
        newCheckOut = target.field === 'check_out' ? newIso : target.existingCheckOut;
      }

      // Recalculate working_hours, is_late, regular_ot_hours, status
      let workingHours: number | null = null;
      let regularOt = 0;
      let isLate = false;

      if (newCheckIn && newCheckOut) {
        const inDate = new Date(newCheckIn);
        const outDate = new Date(newCheckOut);
        const rawHours = (outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60);
        workingHours = Math.max(0, rawHours - lunchBreakHours);
        regularOt = workingHours - shiftDuration;

        const shiftStartHours = parseTimeToHours(shiftStart);
        const inHours = inDate.getHours() + inDate.getMinutes() / 60;
        isLate = (inHours - shiftStartHours) * 60 > lateThresholdMin;
      }

      if (isBoth && mode === 'insert') {
        const { data: inserted, error: insErr } = await supabase
          .from('attendance_records')
          .insert({
            company_id: employee.company_id,
            employee_id: target.employeeId,
            employee_code: target.employeeCode ?? null,
            date: target.date,
            check_in: newCheckIn,
            check_out: newCheckOut,
            working_hours: workingHours ?? 0,
            regular_ot_hours: regularOt,
            holiday_ot_hours: 0,
            is_late: isLate,
            is_absent: false,
            is_weekend: false,
            is_holiday: false,
            status: isLate ? 'late' : 'present',
            source: 'manual_entry',
            notes: null,
          })
          .select('id')
          .single();
        if (insErr) throw insErr;

        const { error: logErr } = await supabase
          .from('attendance_manual_logs')
          .insert([
            {
              company_id: employee.company_id,
              attendance_record_id: inserted.id,
              employee_id: target.employeeId,
              date: target.date,
              field_updated: 'check_in',
              old_value: null,
              new_value: newCheckIn,
              updated_by: employee.employee_id,
              reason: reason.trim(),
            },
            {
              company_id: employee.company_id,
              attendance_record_id: inserted.id,
              employee_id: target.employeeId,
              date: target.date,
              field_updated: 'check_out',
              old_value: null,
              new_value: newCheckOut,
              updated_by: employee.employee_id,
              reason: reason.trim(),
            },
          ]);
        if (logErr) throw logErr;
      } else {
        const updatePayload = (isBoth
          ? {
              check_in: newCheckIn,
              check_out: newCheckOut,
              working_hours: workingHours ?? 0,
              regular_ot_hours: regularOt,
              is_late: isLate,
              is_absent: false,
              status: isLate ? 'late' : 'present',
              notes: null as string | null,
            }
          : {
              [target.field]: target.field === 'check_in' ? newCheckIn : newCheckOut,
              working_hours: workingHours ?? 0,
              regular_ot_hours: regularOt,
              is_late: isLate,
              status: 'present',
              notes: null as string | null,
            }) as never;

        const { error: updErr } = await supabase
          .from('attendance_records')
          .update(updatePayload)
          .eq('id', target.recordId)
          .eq('company_id', employee.company_id);
        if (updErr) throw updErr;

        const logRows = isBoth
          ? [
              {
                company_id: employee.company_id,
                attendance_record_id: target.recordId,
                employee_id: target.employeeId,
                date: target.date,
                field_updated: 'check_in',
                old_value: target.existingCheckIn,
                new_value: newCheckIn,
                updated_by: employee.employee_id,
                reason: reason.trim(),
              },
              {
                company_id: employee.company_id,
                attendance_record_id: target.recordId,
                employee_id: target.employeeId,
                date: target.date,
                field_updated: 'check_out',
                old_value: target.existingCheckOut,
                new_value: newCheckOut,
                updated_by: employee.employee_id,
                reason: reason.trim(),
              },
            ]
          : [
              {
                company_id: employee.company_id,
                attendance_record_id: target.recordId,
                employee_id: target.employeeId,
                date: target.date,
                field_updated: target.field,
                old_value: target.field === 'check_in' ? target.existingCheckIn : target.existingCheckOut,
                new_value: target.field === 'check_in' ? newCheckIn : newCheckOut,
                updated_by: employee.employee_id,
                reason: reason.trim(),
              },
            ];

        const { error: logErr } = await supabase
          .from('attendance_manual_logs')
          .insert(logRows);
        if (logErr) throw logErr;
      }

      toast.success('Entry updated successfully.');
      resetForm();
      onSaved();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? 'Failed to update entry');
    } finally {
      setSaving(false);
    }
  };

  const dateLabel = target ? format(new Date(`${target.date}T00:00:00`), 'EEE, dd MMM yyyy') : '';
  const fieldLabel = target?.field === 'check_in' ? 'Check-in' : 'Check-out';

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'var(--ff-display)' }}>
            Add Missing Entry — {dateLabel}
          </DialogTitle>
        </DialogHeader>

        {target?.employeeName && (
          <p className="text-sm text-muted-foreground -mt-2">
            Employee: <span className="font-medium text-foreground">{target.employeeName}</span>
          </p>
        )}

        <div className="space-y-4 pt-2">
          {isBoth ? (
            <>
              <p className="text-sm text-muted-foreground">
                Both check-in and check-out are missing for this day.
              </p>

              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="missing-check-in">
                  Check-in time <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="missing-check-in"
                  type="time"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="missing-check-out">
                  Check-out time <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="missing-check-out"
                  type="time"
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                  disabled={saving}
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">Missing field</Label>
                <div className="text-sm font-medium">{fieldLabel}</div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="missing-time">{fieldLabel} time</Label>
                <Input
                  id="missing-time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  disabled={saving}
                />
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="missing-reason">Reason <span className="text-destructive">*</span></Label>
            <Textarea
              id="missing-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Machine error, Forgot to punch out"
              rows={3}
              disabled={saving}
              maxLength={500}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
