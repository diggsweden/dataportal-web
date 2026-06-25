import { useCallback, useEffect, useRef, useState } from "react";

export function useStateCallback<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);
  const cbRef = useRef<((state: T) => void) | null>(null);

  const setStateCallback = useCallback((state: T, cb?: (state: T) => void) => {
    cbRef.current = cb ?? null;
    setState(state);
  }, []);

  useEffect(() => {
    // cb.current is `null` on initial render,
    // so we only invoke callback on state *updates*
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null; // reset callback after execution
    }
  }, [state]);

  return [state, setStateCallback] as const;
}
