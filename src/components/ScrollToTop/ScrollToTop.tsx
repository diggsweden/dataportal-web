import {
  ArrowIcon,
  Box,
  colorPalette,
  styled,
  StyledButton,
  Text,
} from '@digg/design-system';
import React from 'react';
import { EventEffect } from '../EventEffect';
import i18n from 'i18n';

const SpanBox = Box.withComponent('span');

const LinkButton = StyledButton.withComponent('a');

const BackToTopLink = styled(LinkButton)`
  color: inherit;
  font-weight: normal;
  line-height: normal;
  display: flex;
  height: 50%;
  width: auto;
  background-color: transparent;
  text-decoration: none;
`;

export interface ScrollToTopProps {
  onScroll?: () => void;
}

export const ScrollToTop: React.SFC<ScrollToTopProps> = ({ onScroll }) => {
  const scrollToTop = (ev: React.MouseEvent) => {
    ev.preventDefault();
    onScroll && onScroll();
    if (typeof window !== 'undefined') {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <EventEffect full>
      {({ className }) => (
        <BackToTopLink href="#top" onClick={scrollToTop} className={className}>
          <SpanBox display="flex" alignItems="center">
            <Text
              element="span"
              marginRight={1}
              lineHeight={1.2}
              align="left"
              size={[2, 4]}
            >
              {i18n.t('common|to-top')}
            </Text>
          </SpanBox>
        </BackToTopLink>
      )}
    </EventEffect>
  );
};
