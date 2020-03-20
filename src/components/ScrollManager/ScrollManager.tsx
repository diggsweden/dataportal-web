import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

export interface ScrollManagerProps extends RouteComponentProps<any> {}

class ScrollManagerComponent extends React.PureComponent<ScrollManagerProps> {
  componentDidUpdate(prevProps: ScrollManagerProps) {
    const previous = prevProps.location.pathname;
    const current = this.props.location.pathname;
    const action = this.props.history.action;

    if (previous === current) return;
    if (action !== 'PUSH') return;

    window.scroll(0, 0);
  }

  render() {
    return null;
  }
}

export const ScrollManager = withRouter(ScrollManagerComponent);
