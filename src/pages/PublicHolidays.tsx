import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format, parse, getDay, getDaysInMonth, startOfMonth, getYear } from 'date-fns';
import { formatDate } from '@/lib/format-date';
import { Calendar as CalendarIcon, List, Plus, Trash2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Holiday {
  id: string;
  company_id: string;
  date: string;
  name: string;
  is_recurring: boolean;
  year: number;
}

const PAKISTAN_HOLIDAYS = [
  { name: 'Kashmir Day', month: 2, day: 5 },
  { name: 'Pakistan Day', month: 3, day: 23 },
  { name: 'Labour Day', month: 5, day: 1 },
  { name: 'Independence Day', month: 8, day: 14 },
  { name: 'Iqbal Day', month: 11, day: 9 },
  { name: "Quaid-e-Azam Day", month: 12, day: 25 },
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const PublicHolidays = () => {
  const { employee } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const currentYear = new Date().getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<Date | undefined>(undefined);
  const [modalName, setModalName] = useState('');
  const [modalRecurring, setModalRecurring] = useState(false);
  const [nameError, setNameError] = useState('');
  const [dateError, setDateError] = useState('');
  const [calPopover, setCalPopover] = useState<string | null>(null);

  const companyId = employee?.company_id;
  const canManage = employee?.role_name === 'hr_manager' || employee?.role_name === 'ceo';

  const { data: holidays = [], isLoading } = useQuery({
    queryKey: ['public-holidays', companyId, selectedYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_holidays')
        .select('*')
        .eq('company_id', companyId!)
        .eq('year', selectedYear)
        .order('date', { ascending: true });
      if (error) throw error;
      return data as Holiday[];
    },
    enabled: !!companyId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('public_holidays').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public-holidays', companyId, selectedYear] });
      toast({ title: 'Holiday deleted' });
      setCalPopover(null);
    },
  });

  const addMutation = useMutation({
    mutationFn: async (h: { date: string; name: string; is_recurring: boolean; year: number }) => {
      const { error } = await supabase.from('public_holidays').insert({
        company_id: companyId!,
        ...h,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public-holidays', companyId, selectedYear] });
      toast({ title: 'Holiday added' });
      closeModal();
    },
  });

  const preloadMutation = useMutation({
    mutationFn: async () => {
      const rows = PAKISTAN_HOLIDAYS.map(h => ({
        company_id: companyId!,
        name: h.name,
        date: `${selectedYear}-${String(h.month).padStart(2, '0')}-${String(h.day).padStart(2, '0')}`,
        is_recurring: true,
        year: selectedYear,
      }));
      const { error } = await supabase.from('public_holidays').insert(rows);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public-holidays', companyId, selectedYear] });
      toast({ title: 'Pakistan public holidays loaded!' });
    },
  });

  const closeModal = () => {
    setModalOpen(false);
    setModalDate(undefined);
    setModalName('');
    setModalRecurring(false);
    setNameError('');
    setDateError('');
  };

  const openModal = (date?: Date) => {
    setModalDate(date);
    setModalName('');
    setModalRecurring(false);
    setNameError('');
    setDateError('');
    setModalOpen(true);
  };

  const handleSave = () => {
    let valid = true;
    if (!modalDate) { setDateError('Date is required'); valid = false; } else { setDateError(''); }
    if (!modalName.trim()) { setNameError('Holiday name is required'); valid = false; } else { setNameError(''); }
    if (!valid) return;
    addMutation.mutate({
      date: format(modalDate!, 'yyyy-MM-dd'),
      name: modalName.trim(),
      is_recurring: modalRecurring,
      year: getYear(modalDate!),
    });
  };

  // Group holidays by month for list view
  const grouped = useMemo(() => {
    const map: Record<string, Holiday[]> = {};
    holidays.forEach(h => {
      const d = parse(h.date, 'yyyy-MM-dd', new Date());
      const key = format(d, 'MMMM');
      if (!map[key]) map[key] = [];
      map[key].push(h);
    });
    return map;
  }, [holidays]);

  // Holiday lookup by date string for calendar view
  const holidayMap = useMemo(() => {
    const map: Record<string, Holiday> = {};
    holidays.forEach(h => { map[h.date] = h; });
    return map;
  }, [holidays]);

  const showPreload = canManage && !isLoading && holidays.length === 0 && selectedYear === currentYear;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {isLoading ? '...' : `${holidays.length} holiday${holidays.length !== 1 ? 's' : ''} in ${selectedYear}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Year selector */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card px-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedYear(y => y - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium w-12 text-center">{selectedYear}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedYear(y => y + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          {/* View toggle */}
          <div className="flex rounded-lg border border-border bg-card p-0.5">
            <Button
              variant={view === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 px-3"
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4 mr-1.5" /> List
            </Button>
            <Button
              variant={view === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 px-3"
              onClick={() => setView('calendar')}
            >
              <CalendarIcon className="h-4 w-4 mr-1.5" /> Calendar
            </Button>
          </div>
          {canManage && (
            <Button onClick={() => openModal()} size="sm">
              <Plus className="h-4 w-4 mr-1.5" /> Add Holiday
            </Button>
          )}
        </div>
      </div>

      {/* Preload banner */}
      {showPreload && (
        <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-5 py-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <p className="text-sm text-foreground">
              No holidays added yet. Would you like to load Pakistan's public holidays for {selectedYear}?
            </p>
          </div>
          <Button size="sm" onClick={() => preloadMutation.mutate()} disabled={preloadMutation.isPending}>
            {preloadMutation.isPending ? 'Loading…' : 'Load Pakistan Holidays'}
          </Button>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      )}

      {/* List View */}
      {!isLoading && view === 'list' && (
        holidays.length === 0 && !showPreload ? (
          <div className="text-center py-16 text-muted-foreground">
            No holidays added for {selectedYear} yet
          </div>
        ) : (
          <div className="space-y-6">
            {MONTHS.map(month => {
              const items = grouped[month];
              if (!items) return null;
              return (
                <div key={month}>
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{month}</h3>
                  <div className="rounded-lg border border-border bg-card divide-y divide-border">
                    {items.map(h => {
                      const d = parse(h.date, 'yyyy-MM-dd', new Date());
                      return (
                        <div key={h.id} className="flex items-center justify-between px-4 py-3">
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground w-36">{formatDate(d)}</span>
                            <span className="text-sm font-medium text-foreground">{h.name}</span>
                            {h.is_recurring && (
                              <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">Recurring</span>
                            )}
                          </div>
                          {canManage && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => deleteMutation.mutate(h.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Calendar View */}
      {!isLoading && view === 'calendar' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MONTHS.map((month, mi) => (
            <MiniMonth
              key={month}
              month={mi}
              year={selectedYear}
              monthName={month}
              holidayMap={holidayMap}
              calPopover={calPopover}
              setCalPopover={setCalPopover}
              onDelete={(id) => deleteMutation.mutate(id)}
              onAddDate={(date) => openModal(date)}
              deleting={deleteMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Add Holiday Modal */}
      <Dialog open={modalOpen} onOpenChange={v => { if (!v) closeModal(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Public Holiday</DialogTitle>
            <DialogDescription>Add a new holiday for your company.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Date <span className="text-destructive">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn('w-full justify-start text-left font-normal', !modalDate && 'text-muted-foreground')}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {modalDate ? formatDate(modalDate) : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={modalDate}
                    onSelect={(d) => { setModalDate(d); setDateError(''); }}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {dateError && <p className="text-xs text-destructive">{dateError}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Holiday Name <span className="text-destructive">*</span></Label>
              <Input
                placeholder="e.g. Independence Day"
                value={modalName}
                onChange={e => { setModalName(e.target.value); setNameError(''); }}
                onBlur={() => { if (!modalName.trim()) setNameError('Holiday name is required'); }}
              />
              {nameError && <p className="text-xs text-destructive">{nameError}</p>}
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="recurring"
                checked={modalRecurring}
                onCheckedChange={v => setModalRecurring(v === true)}
                className="mt-0.5"
              />
              <div>
                <Label htmlFor="recurring" className="text-sm cursor-pointer">Repeat every year on this date</Label>
                <p className="text-xs text-muted-foreground">If checked, this holiday applies to future years</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button onClick={handleSave} disabled={addMutation.isPending}>
              {addMutation.isPending ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ---------- Mini Month Component ---------- */

interface MiniMonthProps {
  month: number;
  year: number;
  monthName: string;
  holidayMap: Record<string, Holiday>;
  calPopover: string | null;
  setCalPopover: (id: string | null) => void;
  onDelete: (id: string) => void;
  onAddDate: (date: Date) => void;
  deleting: boolean;
}

const MiniMonth = ({ month, year, monthName, holidayMap, calPopover, setCalPopover, onDelete, onAddDate, deleting }: MiniMonthProps) => {
  const firstDay = startOfMonth(new Date(year, month));
  const totalDays = getDaysInMonth(firstDay);
  // getDay: 0=Sun, convert to Mon-start: (getDay + 6) % 7
  const startOffset = (getDay(firstDay) + 6) % 7;

  const cells: (number | null)[] = Array.from({ length: startOffset }, () => null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <h4 className="text-sm font-semibold text-foreground mb-2">{monthName}</h4>
      <div className="grid grid-cols-7 gap-px text-center">
        {WEEKDAYS.map(wd => (
          <div key={wd} className="text-[10px] font-medium text-muted-foreground py-1">{wd}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const holiday = holidayMap[dateStr];
          const dayOfWeek = (startOffset + day - 1) % 7; // 0=Mon
          const isWeekend = dayOfWeek >= 5; // 5=Sat, 6=Sun

          const dayEl = (
            <button
              key={dateStr}
              onClick={() => {
                if (holiday) {
                  setCalPopover(calPopover === holiday.id ? null : holiday.id);
                } else {
                  onAddDate(new Date(year, month, day));
                }
              }}
              className={cn(
                'relative h-7 w-full rounded text-xs transition-colors',
                holiday
                  ? 'bg-primary text-primary-foreground font-medium hover:bg-primary/90'
                  : isWeekend
                    ? 'bg-muted/60 text-muted-foreground hover:bg-muted'
                    : 'text-foreground hover:bg-accent',
              )}
            >
              {day}
            </button>
          );

          if (holiday) {
            return (
              <Popover key={dateStr} open={calPopover === holiday.id} onOpenChange={v => setCalPopover(v ? holiday.id : null)}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      {dayEl}
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">{holiday.name}</TooltipContent>
                </Tooltip>
                <PopoverContent className="w-48 p-3" align="center" side="top">
                  <p className="text-sm font-medium text-foreground mb-2">{holiday.name}</p>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => onDelete(holiday.id)}
                    disabled={deleting}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
                  </Button>
                </PopoverContent>
              </Popover>
            );
          }

          return dayEl;
        })}
      </div>
    </div>
  );
};

export default PublicHolidays;
