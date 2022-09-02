import React from 'react';
import { globalStyles, css, Global } from '@digg/design-system';

export interface GlobalStylesProps {
  theme: DiggTheme;
}

export const GlobalStyles: React.FC<GlobalStylesProps> = (props) => (
  <Global
    styles={css`
      ${globalStyles({ theme: props.theme })}
      body {
        overflow-x: hidden;
        -ms-scroll-limit-x-max: 0;
      }
    `}
  />
);
