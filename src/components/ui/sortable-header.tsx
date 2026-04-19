import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { TableHead } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { SortDir, SortState } from '@/hooks/useSort';

interface SortableHeaderProps {
  column: string;
  sort: SortState;
  onSort: (column: string) => void;
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'right' | 'center';
}

/**
 * Drop-in TableHead replacement with click-to-sort behavior.
 * Shows chevron-up / chevron-down when active, faint double-arrow on hover when unsorted.
 */
export function SortableHeader({
  column,
  sort,
  onSort,
  children,
  className,
  align = 'left',
}: SortableHeaderProps) {
  const active = sort.column === column;
  const dir: SortDir = active ? sort.direction : null;

  return (
    <TableHead
      className={cn(
        'cursor-pointer select-none transition-colors hover:bg-muted/60 group',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className,
      )}
      onClick={() => onSort(column)}
      aria-sort={dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none'}
    >
      <span
        className={cn(
          'inline-flex items-center gap-1',
          align === 'right' && 'flex-row-reverse',
          align === 'center' && 'justify-center',
        )}
      >
        <span>{children}</span>
        <span className="inline-flex items-center" aria-hidden>
          {dir === 'asc' && <ChevronUp className="h-3.5 w-3.5 text-foreground" />}
          {dir === 'desc' && <ChevronDown className="h-3.5 w-3.5 text-foreground" />}
          {dir === null && (
            <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </span>
      </span>
    </TableHead>
  );
}
