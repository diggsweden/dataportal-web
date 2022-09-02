import { CookieSetting } from '@digg/design-system';
import React, { useEffect } from 'react';
import { useStateCallback } from '../../hooks/useStateCallback';

export interface LocalStore {
  cookieSettings: CookieSetting | undefined;
}

export interface LocalStoreContextData {
  set: (settings: Partial<LocalStore>) => void;
  store: LocalStore;
}

const defaultSettings: LocalStoreContextData = {
  set: () => {},
  store: {
    cookieSettings: undefined,
  },
};

export const LocalStoreContext = React.createContext<LocalStoreContextData>(defaultSettings);

export interface LocalStoreProviderState {
  store: LocalStore;
}

export const LocalStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storeName = 'digg-store';
  const [store, setStore] = useStateCallback(defaultSettings.store);

  const loadData = () => {
    if (!localStorage) return;

    const data = localStorage.getItem(storeName);
    if (!data) {
      setStore({ cookieSettings: {} });
      return;
    }

    let json = JSON.parse(data) as LocalStore;
    if (!json) return;

    setStore(json);
  };

  const set = (partialStore: Partial<LocalStore>) => {
    setStore({ ...store, ...partialStore }, (s: LocalStore) =>
      localStorage.setItem(storeName, JSON.stringify(s))
    );
  };

  const data: LocalStoreContextData = {
    set,
    store,
  };

  /* eslint-disable */
  useEffect(() => {
    loadData();
  }, []);
  /* eslint-enable */

  return <LocalStoreContext.Provider value={data}>{children}</LocalStoreContext.Provider>;
};
