import { useState, useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmployeeOption {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  designation?: string | null;
}

interface SearchableEmployeeSelectProps {
  employees: EmployeeOption[];
  value: string;
  onValueChange: (id: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** If true, adds an "All" option at the top */
  allowAll?: boolean;
  allLabel?: string;
}

const initials = (name: string) =>
  name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const SearchableEmployeeSelect = ({
  employees,
  value,
  onValueChange,
  placeholder = 'Select employee…',
  disabled = false,
  className,
  allowAll = false,
  allLabel = 'All Employees',
}: SearchableEmployeeSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return employees;
    const q = search.toLowerCase();
    return employees.filter(
      e => e.full_name.toLowerCase().includes(q) ||
        (e.designation && e.designation.toLowerCase().includes(q))
    );
  }, [employees, search]);

  const selected = employees.find(e => e.id === value);
  const displayText = allowAll && value === 'all'
    ? allLabel
    : selected?.full_name || placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-between font-normal", !value && "text-muted-foreground", className)}
        >
          <div className="flex items-center gap-2 truncate">
            {selected && (
              <Avatar className="h-5 w-5">
                <AvatarImage src={selected.avatar_url || ''} />
                <AvatarFallback className="text-[8px] bg-secondary text-secondary-foreground">
                  {initials(selected.full_name)}
                </AvatarFallback>
              </Avatar>
            )}
            <span className="truncate">{displayText}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search employees…"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No employee found.</CommandEmpty>
            <CommandGroup>
              {allowAll && (
                <CommandItem
                  value="all"
                  onSelect={() => { onValueChange('all'); setOpen(false); setSearch(''); }}
                >
                  <Check className={cn('mr-2 h-4 w-4', value === 'all' ? 'opacity-100' : 'opacity-0')} />
                  {allLabel}
                </CommandItem>
              )}
              {filtered.map(emp => (
                <CommandItem
                  key={emp.id}
                  value={emp.id}
                  onSelect={() => { onValueChange(emp.id); setOpen(false); setSearch(''); }}
                >
                  <Check className={cn('mr-2 h-4 w-4', value === emp.id ? 'opacity-100' : 'opacity-0')} />
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={emp.avatar_url || ''} />
                    <AvatarFallback className="text-[9px] bg-secondary text-secondary-foreground">
                      {initials(emp.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{emp.full_name}</span>
                  {emp.designation && (
                    <span className="ml-1 text-xs text-muted-foreground">— {emp.designation}</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchableEmployeeSelect;
