import { useMemo, useState, useCallback } from 'react';

export type SortDir = 'asc' | 'desc' | null;

export type SortAccessor<T> = (row: T) => string | number | Date | null | undefined;

export interface SortState {
  column: string | null;
  direction: SortDir;
}

/**
 * Client-side sort hook.
 *
 * Cycle on header click: asc → desc → cleared (null).
 * Pass an `accessors` map keyed by column id; each accessor returns a sortable primitive.
 */
export function useSort<T>(rows: T[], accessors: Record<string, SortAccessor<T>>) {
  const [sort, setSort] = useState<SortState>({ column: null, direction: null });

  const toggleSort = useCallback((column: string) => {
    setSort(prev => {
      if (prev.column !== column) return { column, direction: 'asc' };
      if (prev.direction === 'asc') return { column, direction: 'desc' };
      // was desc → clear
      return { column: null, direction: null };
    });
  }, []);

  const sorted = useMemo(() => {
    if (!sort.column || !sort.direction) return rows;
    const accessor = accessors[sort.column];
    if (!accessor) return rows;

    const dirMul = sort.direction === 'asc' ? 1 : -1;
    const arr = [...rows];
    arr.sort((a, b) => {
      const va = accessor(a);
      const vb = accessor(b);
      // null/undefined always last regardless of direction
      const aNil = va === null || va === undefined || va === '';
      const bNil = vb === null || vb === undefined || vb === '';
      if (aNil && bNil) return 0;
      if (aNil) return 1;
      if (bNil) return -1;

      if (va instanceof Date || vb instanceof Date) {
        const da = va instanceof Date ? va.getTime() : new Date(va as any).getTime();
        const db = vb instanceof Date ? vb.getTime() : new Date(vb as any).getTime();
        return (da - db) * dirMul;
      }
      if (typeof va === 'number' && typeof vb === 'number') {
        return (va - vb) * dirMul;
      }
      return String(va).localeCompare(String(vb), undefined, { numeric: true, sensitivity: 'base' }) * dirMul;
    });
    return arr;
  }, [rows, sort, accessors]);

  return { sorted, sort, toggleSort };
}
