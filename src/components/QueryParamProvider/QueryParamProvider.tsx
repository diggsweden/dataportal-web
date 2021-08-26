import React from 'react';

export interface QueryParameters {
  all: URLSearchParams;
}

export const QueryParamContext = React.createContext<QueryParameters>({
  all: new URLSearchParams(),
});

export const QueryParamProvider: React.FC<{ params: URLSearchParams }> = ({
  params,
  children,
}) => {
  const parsedParams: QueryParameters = {
    all: params,
  };

  return (
    <QueryParamContext.Provider value={parsedParams}>
      {children}
    </QueryParamContext.Provider>
  );
};
