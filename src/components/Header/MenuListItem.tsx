import { colorPalette, styled, Box } from '@digg/design-system';

const LiBox = Box.withComponent('li');

export const MenuListItem = styled(LiBox)`
  color: ${colorPalette.grey1};

  &::after {
    content: '/';
    display: inline-block;
    font-weight: bold;
    margin: 1rem 2.5rem;
  }

  &:last-child::after {
    display: none;
  }
`;
