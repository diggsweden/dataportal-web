import React from 'react';
import { css, fontSize, space, styled } from '@digg/design-system';
import { colorPalette } from '@digg/design-system';
import { Button, ArrowDropIcon } from '@digg/design-system';

// @ts-ignore
const SearchFilterButton = styled(Button)`
  transition: background-color 0.25s cubic-bezier(0.1, 0.89, 0.45, 0.94);
  &:hover,
  &:focus {
    box-shadow: none;
    background-color: ${colorPalette.gray200};
    color: ${colorPalette.gray900};
  }
  text-align: left;
`;

export interface SearchFilterViewProps {
  children?: any;
  onClick: () => any;
  open: boolean;
  title?: String | null;
}

export const SearchFilterView: React.FC<SearchFilterViewProps> = ({
  onClick,
  open,
  title,
  children,
}) => (
  <>
    <div>
      <SearchFilterButton
        className={open ? 'text-base open' : 'text-base'}
        onClick={onClick}
        aria-haspopup={true}
        aria-expanded={open}
      >
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
          `}
        >
          <span
            css={css`
              ${fontSize('base')};
              margin-bottom: 0;
            `}
          >
            {title || 'Öppna'}
          </span>

          <div>
            <ArrowDropIcon
              rotation={open ? -180 : 0}
              width={[20, 25]}
              color="#5A6751"
            />
          </div>
        </div>
      </SearchFilterButton>
    </div>
    <div
      css={css`
        display: ${open ? 'block' : 'none'};
        ${space({ p: [4, 6, 8] })}
      `}
    >
      {children}
    </div>
  </>
);
