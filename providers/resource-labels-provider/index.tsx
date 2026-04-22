"use client";

import { createContext, FC, ReactNode, useContext } from "react";

type ResourceLabels = Record<string, string>;

const ResourceLabelsContext = createContext<ResourceLabels>({});

interface ResourceLabelsProviderProps {
  labels: ResourceLabels;
  children: ReactNode;
}

export const ResourceLabelsProvider: FC<ResourceLabelsProviderProps> = ({
  labels,
  children,
}) => {
  return (
    <ResourceLabelsContext.Provider value={labels}>
      {children}
    </ResourceLabelsContext.Provider>
  );
};

export const useResourceLabels = (): ResourceLabels => {
  return useContext(ResourceLabelsContext);
};
