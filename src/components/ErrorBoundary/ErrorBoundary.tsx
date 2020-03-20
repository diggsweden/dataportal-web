import React from 'react';
import loadable from 'loadable-components';

const DevelopmentBoundary = loadable(() =>
  import('./DevelopmentBoundary').then(c => c.DevelopmentBoundary, e => e as React.SFC<ErrorBoundaryProps>)
);
const ProductionBoundary = loadable(() =>
  import('./ProductionBoundary').then(c => c.ProductionBoundary, e => e as React.SFC<ErrorBoundaryProps>)
);

export interface ErrorInfo {
  componentStack: string;
}

export interface ErrorBoundaryProps {
  reload: () => void;
  goHome: () => void;
  error: Error;
  info: ErrorInfo | null;
}

export interface ErrorBoundaryState {
  caughtError: boolean;
  error: Error | null;
  info: ErrorInfo | null;
}

export class ErrorBoundary extends React.PureComponent<
  any,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    caughtError: false,
    error: null,
    info: null,
  };

  componentDidCatch(error: Error, info: any) {
    this.setState({
      caughtError: true,
      error,
      info,
    });
  }

  reload = () => window.location.reload();
  goHome = () => (window.location.pathname = '/');

  render() {
    if (this.state.caughtError && this.state.error) {
      const Boundary =
        process.env.NODE_ENV === 'production'
          ? ProductionBoundary
          : DevelopmentBoundary;
      return (
        <Boundary
          reload={this.reload}
          goHome={this.goHome}
          error={this.state.error}
          info={this.state.info}
        />
      );
    }

    return this.props.children;
  }
}
