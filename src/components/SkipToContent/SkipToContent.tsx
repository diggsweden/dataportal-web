import { styled } from '@digg/design-system';
import React from 'react';
import { EventEffect } from '../EventEffect';

import 'scss/general/general.scss';

const SkipLink = styled('button')`
  display: block;
  position: absolute;
  top: 0;
  padding: 2rem 4rem;
  z-index: 10;
  background-color: ${props => props.theme.color.background};
  color: ${props => props.theme.color.primary};

  transform: translateY(-100%);
  opacity: 0;

  &:focus {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const skipToContent = (ev?: React.MouseEvent) => {
  if (ev) {
    ev.preventDefault();
  }
  let content = document.querySelector('[data-content]');
  if (!content) content = document.querySelector('main');
  if (!content) return;

  const focusable = content.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const first = focusable[0];

  if (first) {
    first.focus();
  }
};

export const SkipToContent = () => (
  <EventEffect outline noHover noColorInvert>
    {({ className }) => (
      <>
        <SkipLink className={className} onClick={skipToContent}>
          Till innehållet
        </SkipLink>

        <noscript>
          <a className="skiptocontent_nojs" href="#main">Till innehållet</a>
        </noscript>
      </>
    )}
  </EventEffect>
);
