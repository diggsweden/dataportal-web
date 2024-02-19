import { useEffect, useRef } from "react";

export const useClickoutside = (onClickOutside: () => void) => {
  const ref = useRef() as any;
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutside]);

  return ref;
};
