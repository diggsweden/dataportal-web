"use client";

import { createContext, FC, ReactNode, useContext } from "react";

const MediaUrlContext = createContext<string>("");

interface MediaUrlProviderProps {
  baseUrl: string;
  children: ReactNode;
}

export const MediaUrlProvider: FC<MediaUrlProviderProps> = ({
  baseUrl,
  children,
}) => {
  return (
    <MediaUrlContext.Provider value={baseUrl}>
      {children}
    </MediaUrlContext.Provider>
  );
};

export const useMediaBaseUrl = (): string => {
  return useContext(MediaUrlContext);
};
