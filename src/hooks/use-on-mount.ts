import { useEffect } from "react";

/**
 * Runs an effect once on mount and optionally cleans up on unmount.
 *
 * Use only for truly mount-only work: subscriptions, timers, imperative browser
 * APIs, or Three.js resource disposal. The closure is captured at mount and is
 * **not** re-run when props or state change. Do not read values that may change
 * after mount unless they are stable for the component's lifetime (e.g.
 * `useMemo(..., [])`, refs, or module-level constants). If cleanup must see
 * the latest value, store it in a ref or use `useEffect` with an explicit
 * dependency array instead.
 */
export function useOnMount(effect: () => void | (() => void)) {
  // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only by design
  useEffect(effect, []);
}
