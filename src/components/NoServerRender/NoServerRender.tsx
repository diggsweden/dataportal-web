import React from 'react';

export const NoServerRender: React.SFC<any> = props => (
  <div>{process.env.CLIENT ? props.children : null}</div>
);
