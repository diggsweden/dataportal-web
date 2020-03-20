import { Link } from 'react-router-dom';
import { styled } from '@digg/design-system';

export const StyledA = styled('a')`
  color: #000;
  font-weight: 500;
  opacity: 0.8;

  &:visited {
    opacity: 0.9;
  }

  &:hover {
    opacity: 1;
  }
`;

export const StyledLink = StyledA.withComponent(Link);
