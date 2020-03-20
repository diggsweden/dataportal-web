import React from 'react';

export interface LocalStore {
  cookiesAccepted: boolean;
}

export interface LocalStoreContextData {
  set: (settings: Partial<LocalStore>) => void;
  store: LocalStore;
}

const defaultSettings: LocalStoreContextData = {
  set: () => {},
  store: {
    cookiesAccepted: false,
  },
};

export const LocalStoreContext = React.createContext<LocalStoreContextData>(
  defaultSettings
);

export interface LocalStoreProviderState {
  store: LocalStore;
}

export class LocalStoreProvider extends React.Component<
  {},
  LocalStoreProviderState
> {
  state: LocalStoreProviderState = {
    store: { ...defaultSettings.store },
  };

  componentDidMount() {
    this.loadData();
  }

  private storeName = 'digg-store';

  loadData() {
    if (!localStorage) return;

    const data = localStorage.getItem(this.storeName);
    if (!data) return;

    let store = JSON.parse(data) as LocalStore;
    if (!store) return;

    this.setState({ store });
  }

  set = (store: Partial<LocalStore>) => {
    this.setState(
      state => ({
        store: {
          ...state.store,
          ...store,
        },
      }),
      () => {
        if (!localStorage) return;
        localStorage.setItem(this.storeName, JSON.stringify(this.state.store));
      }
    );
  };

  render() {
    const data: LocalStoreContextData = {
      set: this.set,
      store: this.state.store,
    };

    return (
      <LocalStoreContext.Provider value={data}>
        {this.props.children}
      </LocalStoreContext.Provider>
    );
  }
}
