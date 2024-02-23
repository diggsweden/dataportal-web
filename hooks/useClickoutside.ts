import { useEffect, useRef } from "react";

export const useClickoutside = (
  onClickOutside: () => void,
  excludedSelectors: string[] = [],
) => {
  const ref = useRef() as any;

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      const isExcluded = excludedSelectors.some(
        (selector) => document.querySelector(selector)?.contains(event.target),
      );

      if (ref.current && !ref.current.contains(event.target) && !isExcluded) {
        onClickOutside();
      }
    };

    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutside, excludedSelectors]);

  return ref;
};
