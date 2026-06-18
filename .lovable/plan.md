## Problem

On the Payroll page, when the user is on a specific department tab (e.g. "GC Team") and stays for a while, the page resets to the "Summary" tab. Root cause is the same as the month/year reset we just fixed: auth token refresh or tab visibility events cause the route component to remount, and `activeTab` is initialized to the literal `'summary'`, so the selection is lost.

## Fix

In `src/pages/Payroll.tsx`, persist `activeTab` in `sessionStorage` so it survives unmounts, matching the pattern already in place for `selectedMonth` / `selectedYear`.

### Change 1 — initializer (around line 80)

```ts
const [activeTab, setActiveTab] = useState<string>(() => {
  const stored = typeof window !== 'undefined'
    ? sessionStorage.getItem('payroll.activeTab')
    : null;
  return stored ?? 'summary';
});
```

### Change 2 — write on change (add near the existing month/year persistence effect)

```ts
useEffect(() => {
  sessionStorage.setItem('payroll.activeTab', activeTab);
}, [activeTab]);
```

## Notes

- Uses `sessionStorage` (not `localStorage`) so it clears when the tab closes — same scope as the month/year fix.
- If a stored tab no longer exists (e.g. a department was renamed), the existing `Tabs` component will simply render nothing selected; users can click any tab to recover. No extra validation needed unless you want me to add it.
- No other files change. No behavior change to tab labels, ordering, or visibility.

## Verification

1. Open Payroll, switch to "GC Team".
2. Leave the tab idle for a few minutes (or trigger a token refresh by switching browser tabs and back).
3. Confirm the page stays on "GC Team" instead of jumping to Summary.
