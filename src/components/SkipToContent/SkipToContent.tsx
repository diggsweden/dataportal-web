import { styled } from '@digg/design-system';
import React from 'react';
import { EventEffect } from '../EventEffect';
import i18n from 'i18n';

import 'scss/general/general.scss';
import 'scss/general/variables.scss';

const SkipLink = styled('button')`
  display: block;
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 2rem;
  z-index: 10;
  background-color: #2b2a29;
  border-color: #2b2a29;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;

  transform: translateY(-100%);
  opacity: 0;

  &:hover {
    color: #ffffff;
    background-color: #5a5856;
    border-color: #2b2a29;
  }

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
      <div>
        <SkipLink className={className} onClick={skipToContent}>
          {i18n.t('common|skiptocontent')}
        </SkipLink>

        <noscript>
          <a className="skiptocontent_nojs" href="#main">
            {i18n.t('common|skiptocontent')}
          </a>
        </noscript>
      </div>
    )}
  </EventEffect>
);

/**
 * Skips to the desired element by setting focus to it
 * and scrolls it into view
 * @param id to the html-element
 * @param ev the clickEvent that occurs
 */
export const skipToElement = (id: string, ev?: React.MouseEvent) => {
  if (ev) {
    ev.preventDefault();
  }
  id = id.replace('#', '');
  const element = document.getElementById(id);
  if (!element) return;

  if (element.title == 'anchorTarget') {
    const sibling = document.getElementById(`${id}-value`);
    if (sibling) {
      sibling.tabIndex = -1;
      sibling.focus();
      element.scrollIntoView();
    }
    return;
  }

  if (element.nodeName == 'H1') {
    element.tabIndex = -1;
  }

  element.focus();
  element.scrollIntoView();
};

/**
 * When using internal links, scroll position
 * might not be at the top, this function can then
 * be used to reset the scroll
 */
export const startFromTop = () => {
  if (typeof window !== 'undefined') {
    // Dirty solution to prevent smooth scrolling
    const html = document.querySelector('html');
    html && (html.style.scrollBehavior = 'auto');

    // Scroll to top
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'auto',
    });

    // Todo: find a better solution for handling scrollbehaviour
    html && (html.style.scrollBehavior = 'smooth');
  }
};
