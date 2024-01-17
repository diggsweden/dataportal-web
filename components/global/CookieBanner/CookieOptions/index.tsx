import React from "react";
import {
  CookieSetting,
  NecessaryCookies,
} from "@/components/global/CookieBanner";
import { useEffect, useRef } from "react";
import { Heading } from "@/components/global/Typography/Heading";
import { Toggle } from "@/components/global/Form/Toggle";

export interface CookieOptionsProps {
  cookieSettingsHeading: string;
  cookieSettings: CookieSetting;
  setCookieSettings: React.Dispatch<React.SetStateAction<CookieSetting>>;
  necessaryCookieText?: NecessaryCookies;
}

export const CookieOptions: React.FC<CookieOptionsProps> = ({
  cookieSettingsHeading,
  cookieSettings,
  setCookieSettings,
  necessaryCookieText,
}) => {
  const keys = Object.keys(cookieSettings);
  const firstInputElement = useRef(null);
  const lastInputElement = useRef(null);

  const setInputRefs = (index: number) => {
    if (index === 0) return firstInputElement;

    if (keys.length - 1 === index) return lastInputElement;

    return null;
  };

  useEffect(() => {
    if (firstInputElement && firstInputElement.current) {
      const input = firstInputElement.current as unknown as HTMLInputElement;
      input.focus();
    }
  }, []);

  return (
    <div className="mb-lg bg-white p-lg">
      <Heading level={3} size="sm">
        {cookieSettingsHeading}
      </Heading>

      {necessaryCookieText && (
        <div className="mb-lg">
          <p className="mb-xs font-strong">{necessaryCookieText.heading}</p>
          <p>{necessaryCookieText.description}</p>
        </div>
      )}

      {keys.map((key, index) => (
        <div key={key + index}>
          <div className="mb-xs flex items-center">
            <label className="font-strong" htmlFor={key}>
              {cookieSettings[key].label}
            </label>
            <label className="relative ml-sm inline-flex cursor-pointer items-center">
              <input
                className="peer sr-only"
                ref={setInputRefs(index)}
                aria-describedby={`label-${key}`}
                type="checkbox"
                name={key}
                id={key}
                checked={cookieSettings[key].accepted}
                onChange={() => {
                  setCookieSettings({
                    ...cookieSettings,
                    [key]: {
                      ...cookieSettings[key],
                      accepted: !cookieSettings[key].accepted,
                    },
                  });
                }}
              />
              <Toggle />
            </label>
          </div>

          <p>{cookieSettings[key].description}</p>
        </div>
      ))}
    </div>
  );
};
