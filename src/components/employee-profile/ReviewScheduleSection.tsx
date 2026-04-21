import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, AlertTriangle, Clock } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  computeNextReviewDate,
  getReviewStatus,
  formatNextReviewLabel,
} from '@/lib/review-schedule';

interface Props {
  employeeId: string;
  firstReviewDate: string | null;
  reviewFrequencyMonths: number | null;
  canEdit: boolean;
}

const FREQUENCY_OPTIONS = [
  { value: '3', label: 'Every 3 Months' },
  { value: '6', label: 'Every 6 Months' },
  { value: '12', label: 'Every 12 Months' },
];

const ReviewScheduleSection = ({ employeeId, firstReviewDate, reviewFrequencyMonths, canEdit }: Props) => {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const freqStr = String(reviewFrequencyMonths ?? 6);
  const nextDate = computeNextReviewDate(firstReviewDate, reviewFrequencyMonths);
  const status = getReviewStatus(nextDate);

  const updateField = async (patch: { first_review_date?: string; review_frequency_months?: number }) => {
    setSaving(true);
    try {
      const { error } = await supabase.from('employees').update(patch as any).eq('id', employeeId);
      if (error) throw error;
      toast.success('Review schedule updated');
      queryClient.invalidateQueries({ queryKey: ['employee-profile', employeeId] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const statusBadge = () => {
    if (status === 'overdue') {
      return (
        <span className="inline-flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 rounded-full bg-bx-danger-bg text-[hsl(var(--bx-danger-text))]">
          <AlertTriangle className="h-3 w-3" /> Overdue
        </span>
      );
    }
    if (status === 'due_soon') {
      return (
        <span className="inline-flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 rounded-full bg-bx-warning-bg text-[hsl(var(--bx-warning-text))]">
          <Clock className="h-3 w-3" /> Due soon
        </span>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
      <div>
        <p className="text-[11px] text-muted-foreground mb-1.5" style={{ fontFamily: 'var(--ff-body)' }}>
          First Review Date
        </p>
        {canEdit ? (
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'w-full justify-start text-left font-normal h-9',
                  !firstReviewDate && 'text-muted-foreground',
                )}
                disabled={saving}
              >
                <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                {firstReviewDate ? format(parseISO(firstReviewDate), 'd MMM yyyy') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={firstReviewDate ? parseISO(firstReviewDate) : undefined}
                onSelect={(d) => {
                  if (d) {
                    updateField({ first_review_date: format(d, 'yyyy-MM-dd') });
                    setDatePickerOpen(false);
                  }
                }}
                initialFocus
                className={cn('p-3 pointer-events-auto')}
              />
            </PopoverContent>
          </Popover>
        ) : (
          <p className="text-[13px] text-foreground font-medium">
            {firstReviewDate ? format(parseISO(firstReviewDate), 'd MMM yyyy') : '—'}
          </p>
        )}
      </div>

      <div>
        <p className="text-[11px] text-muted-foreground mb-1.5" style={{ fontFamily: 'var(--ff-body)' }}>
          Review Frequency
        </p>
        {canEdit ? (
          <Select
            value={freqStr}
            onValueChange={(v) => updateField({ review_frequency_months: parseInt(v, 10) })}
            disabled={saving}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FREQUENCY_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p className="text-[13px] text-foreground font-medium">
            {FREQUENCY_OPTIONS.find(o => o.value === freqStr)?.label || '—'}
          </p>
        )}
      </div>

      <div>
        <p className="text-[11px] text-muted-foreground mb-1.5" style={{ fontFamily: 'var(--ff-body)' }}>
          Next Review Due
        </p>
        <div className="flex items-center gap-2 h-9">
          <p
            className={cn(
              'text-[13px] font-medium',
              status === 'overdue' && 'text-[hsl(var(--bx-danger-text))]',
              status === 'due_soon' && 'text-[hsl(var(--bx-warning-text))]',
              status === 'upcoming' && 'text-foreground',
              status === 'unset' && 'text-muted-foreground',
            )}
          >
            {formatNextReviewLabel(nextDate)}
          </p>
          {statusBadge()}
        </div>
      </div>
    </div>
  );
};

export default ReviewScheduleSection;
