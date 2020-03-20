import React from 'react';
import { Global, css } from '@emotion/core'
import { globalStyles, Theme } from '@digg/design-system';

export interface GlobalStylesProps {
  theme: Theme
}

export const GlobalStyles: React.SFC<GlobalStylesProps> = (props) => (
  <Global styles={css`
    ${globalStyles({ theme: props.theme })}
      body {
        overflow-x: hidden;
        -ms-scroll-limit-x-max: 0;
      }
  `} />
);
