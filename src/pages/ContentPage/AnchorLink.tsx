import { styled, colorPalette } from '@digg/design-system';
import React from 'react';
import { skipToElement } from '../../components/SkipToContent';

interface LinkProps {
  active: boolean;
}

const Link = styled('a')<LinkProps>`
  font-size: 16px;
  color: ${colorPalette.black100};
  text-decoration:none;
  ${props =>
    props.active
      ? `border-left: 2px solid ${colorPalette.pink100} !important;`
      : ''}
  ${props =>
    props.active ? 'font-weight: bold;' : ''}
  scroll-behavior: smooth;
  padding-top: 8px;
  span {
    border-bottom: ${props =>
      props.active
        ? 'none !important;'
        : `1px solid ${colorPalette.black100};`};
  }
`;

interface AnchorLinkProps {
  href: string;
  text: string;
  active: boolean;
}

const handleClick = (
  href: string,
  ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>
) => {
  ev.preventDefault();
  location.hash = href;
  skipToElement(href);
};

export const AnchorLink: React.FC<AnchorLinkProps> = ({
  href,
  text,
  active,
}) => (
  <Link
    onClick={ev => handleClick(href, ev)}
    href={href}
    active={active}
    className="anchorLink"
  >
    <span>{text}</span>
  </Link>
);
