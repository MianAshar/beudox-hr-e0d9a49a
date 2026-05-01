import * as React from "react";

/**
 * Returns true when the viewport width is strictly below `breakpoint` px.
 * SSR-safe (defaults to false on first render).
 */
export function useBelow(breakpoint: number) {
  const [below, setBelow] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < breakpoint;
  });

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => setBelow(window.innerWidth < breakpoint);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return below;
}

/** Tailwind `lg` breakpoint (1024px). True on tablet & mobile. */
export const useIsBelowLg = () => useBelow(1024);
