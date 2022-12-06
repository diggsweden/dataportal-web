import { css, fontSize, ArrowDropIcon, space, Button, colorPalette } from '@digg/design-system';
import FocusTrap from 'focus-trap-react';
import { useEffect, useState } from 'react';
import { useClickoutside } from '../../hooks/useClickoutside';

export interface SearchFilterProps {
  /**
   * Title of the button to open the filter
   */
  title: String | null;
  /**
   * Default value for 'open' state
   */
  defaultValue?: boolean;
  /**
   * Content in the filter
   */
  children?: React.ReactNode;
}

const buttonStyles = css`
  transition: background-color 0.25s cubic-bezier(0.1, 0.89, 0.45, 0.94);
  &:focus {
    box-shadow: none;
    background-color: ${colorPalette.gray200};
    color: ${colorPalette.gray900};
  }
  text-align: left;
`;

export const SearchFilter: React.FC<SearchFilterProps> = ({ title, defaultValue, children }) => {
  const [open, setOpen] = useState(false);
  const [trapFocus, setTrapFocus] = useState(false);
  const ref = useClickoutside(() => handleOpen(false));

  const handleOpen = (value: boolean) => {
    setOpen(value);
    setTrapFocus(value);
  };

  useEffect(() => {
    setOpen(defaultValue || false);
  }, []);

  return (
    <FocusTrap
      active={trapFocus}
      focusTrapOptions={{ allowOutsideClick: true }}
    >
      <div
        ref={ref}
        onKeyDown={(ev) => ev.key === 'Escape' && handleOpen(false)}
      >        
        <Button
          css={buttonStyles}
          className={(open ? 'text-base open' : 'text-base') + ' filter-button_mobile'}
          onClick={() => handleOpen(!open)}
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
                color="white"
              />
            </div>
          </div>
        </Button>
        <div
          css={css`
            display: ${open ? 'block' : 'none'};
            ${space({ p: [4, 6, 8] })}
          `}
        >
          {children}
        </div>
      </div>
    </FocusTrap>
  );
};
