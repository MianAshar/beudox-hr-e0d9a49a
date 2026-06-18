import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

const DAYS = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 0, label: 'Sunday' },
];

const TIMEZONES = [
  'Asia/Karachi',
  'Asia/Dubai',
  'Asia/Kolkata',
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'Europe/London',
];

const AttendanceTab = () => {
  const { employee } = useAuth();
  const qc = useQueryClient();
  const companyId = employee?.company_id;

  const { data: settings, isLoading } = useQuery({
    queryKey: ['company-attendance-settings', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .eq('company_id', companyId!)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!companyId,
  });

  const [form, setForm] = useState({
    shift_start_time: '09:00',
    shift_end_time: '18:00',
    late_threshold: 0,
    ot_divisor: 26,
    working_days: [1, 2, 3, 4, 5] as number[],
    timezone: 'Asia/Karachi',
    lunch_break_hours: 1,
    enable_ot_adjustment: true,
    short_time_relaxation_hours: 0,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        shift_start_time: settings.shift_start_time?.slice(0, 5) || '09:00',
        shift_end_time: settings.shift_end_time?.slice(0, 5) || '18:00',
        late_threshold: settings.late_threshold ?? 0,
        ot_divisor: settings.ot_divisor ?? 26,
        working_days: settings.working_days || [1, 2, 3, 4, 5],
        timezone: settings.timezone || 'Asia/Karachi',
        lunch_break_hours: (settings as any).lunch_break_hours ?? 1,
        enable_ot_adjustment: (settings as any).enable_ot_adjustment ?? true,
        short_time_relaxation_hours: Number((settings as any).short_time_relaxation_hours ?? 0),
      });
    }
  }, [settings]);

  const toggleDay = (day: number) => {
    setForm(prev => ({
      ...prev,
      working_days: prev.working_days.includes(day)
        ? prev.working_days.filter(d => d !== day)
        : [...prev.working_days, day].sort(),
    }));
  };

  const handleSave = useCallback(async () => {
    if (!companyId) return;
    setSaving(true);
    try {
      const payload = {
        company_id: companyId,
        shift_start_time: form.shift_start_time,
        shift_end_time: form.shift_end_time,
        late_threshold: form.late_threshold,
        ot_divisor: form.ot_divisor,
        working_days: form.working_days,
        timezone: form.timezone,
        lunch_break_hours: form.lunch_break_hours,
        enable_ot_adjustment: form.enable_ot_adjustment,
        short_time_relaxation_hours: form.short_time_relaxation_hours,
      };

      if (settings) {
        const { error } = await supabase
          .from('company_settings')
          .update(payload as any)
          .eq('id', settings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('company_settings')
          .insert(payload as any);
        if (error) throw error;
      }

      toast.success('Attendance settings saved');
      qc.invalidateQueries({ queryKey: ['company-attendance-settings'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }, [companyId, form, settings, qc]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[400px] rounded-[14px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[14px] border p-6" style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--card))' }}>
        <h3 className="text-[16px] font-semibold text-foreground mb-1" style={{ fontFamily: 'var(--ff-display)' }}>
          Shift & Overtime
        </h3>
        <p className="text-[13px] text-muted-foreground mb-5" style={{ fontFamily: 'var(--ff-body)' }}>
          Configure work hours, overtime calculation, and attendance rules.
        </p>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Shift Start Time</Label>
              <Input
                type="time"
                value={form.shift_start_time}
                onChange={e => setForm(prev => ({ ...prev, shift_start_time: e.target.value }))}
              />
            </div>
            <div>
              <Label>Shift End Time</Label>
              <Input
                type="time"
                value={form.shift_end_time}
                onChange={e => setForm(prev => ({ ...prev, shift_end_time: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Late Arrival Grace Period (minutes)</Label>
              <Input
                type="number"
                min={0}
                value={form.late_threshold}
                onChange={e => setForm(prev => ({ ...prev, late_threshold: parseInt(e.target.value) || 0 }))}
              />
              <p className="text-[10px] text-muted-foreground mt-1" style={{ fontFamily: 'var(--ff-body)' }}>
                Minutes after shift start before an employee is marked late. 0 means any late arrival is flagged immediately.
              </p>
            </div>
            <div>
              <Label>OT Divisor</Label>
              <Input
                type="number"
                min={1}
                value={form.ot_divisor}
                onChange={e => setForm(prev => ({ ...prev, ot_divisor: parseInt(e.target.value) || 26 }))}
              />
              <p className="text-[10px] text-muted-foreground mt-1" style={{ fontFamily: 'var(--ff-body)' }}>
                Used in OT rate calculation: hourly_rate = basic_salary ÷ OT Divisor ÷ daily shift hours
              </p>
            </div>
          </div>

          <div>
            <Label className="mb-3 block">Working Days</Label>
            <div className="flex flex-wrap gap-4">
              {DAYS.map(day => (
                <label key={day.value} className="flex items-center gap-2 text-[13px] cursor-pointer" style={{ fontFamily: 'var(--ff-body)' }}>
                  <Checkbox
                    checked={form.working_days.includes(day.value)}
                    onCheckedChange={() => toggleDay(day.value)}
                  />
                  {day.label}
                </label>
              ))}
            </div>
          </div>

          <div className="max-w-xs">
            <Label>Timezone</Label>
            <Select value={form.timezone} onValueChange={v => setForm(prev => ({ ...prev, timezone: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TIMEZONES.map(tz => (
                  <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Payroll Settings */}
      <div className="rounded-[14px] border p-6" style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--card))' }}>
        <h3 className="text-[16px] font-semibold text-foreground mb-1" style={{ fontFamily: 'var(--ff-display)' }}>
          Payroll Settings
        </h3>
        <p className="text-[13px] text-muted-foreground mb-5" style={{ fontFamily: 'var(--ff-body)' }}>
          Control how attendance affects monthly payroll calculations.
        </p>

        <div className="space-y-5">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <Label className="text-[13px] font-medium">Overtime & Short Time Adjustment</Label>
              <p className="text-[12px] text-muted-foreground mt-1" style={{ fontFamily: 'var(--ff-body)' }}>
                When enabled, payroll includes overtime additions and short time deductions based on attendance. When disabled, employees always receive their full basic salary.
              </p>
            </div>
            <Switch
              checked={form.enable_ot_adjustment}
              onCheckedChange={v => setForm(prev => ({ ...prev, enable_ot_adjustment: v }))}
            />
          </div>

          {form.enable_ot_adjustment && (
            <>
              <div className="max-w-xs">
                <Label>Lunch Break Duration</Label>
                <div className="relative">
                  <Input
                    type="number"
                    min={0}
                    step="0.25"
                    value={form.lunch_break_hours}
                    onChange={e => setForm(prev => ({ ...prev, lunch_break_hours: parseFloat(e.target.value) || 0 }))}
                    className="pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>
                    hours
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1" style={{ fontFamily: 'var(--ff-body)' }}>
                  Subtracted from shift duration to compute working hours per day for OT rate calculation.
                </p>
              </div>

              <div className="max-w-xs">
                <Label>Short Time Relaxation</Label>
                <div className="relative">
                  <Input
                    type="number"
                    min={0}
                    step="0.5"
                    value={form.short_time_relaxation_hours}
                    onChange={e => setForm(prev => ({ ...prev, short_time_relaxation_hours: parseFloat(e.target.value) || 0 }))}
                    className="pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>
                    hours
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1" style={{ fontFamily: 'var(--ff-body)' }}>
                  Monthly grace hours forgiven before short time affects overtime calculation. e.g. set to 3 means up to 3 hours of short time per month is ignored.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Save Attendance Settings
        </Button>
      </div>
    </div>
  );
};

export default AttendanceTab;
