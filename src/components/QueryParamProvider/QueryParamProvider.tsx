import React from 'react';

export interface QueryParameters {
  all: URLSearchParams;
}

export const QueryParamContext = React.createContext<QueryParameters>({
  all: new URLSearchParams(),
});

export class QueryParamProvider extends React.Component<{
  params: URLSearchParams;
}> {
  render() {
    const params = this.props.params;
    const parsedParams: QueryParameters = {
      all: params,
    };

    return (
      <QueryParamContext.Provider value={parsedParams}>
        {this.props.children}
      </QueryParamContext.Provider>
    );
  }
}
