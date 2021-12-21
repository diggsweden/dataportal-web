import * as React from 'react';
import { styled, AccordionViewProps } from '@digg/design-system';
import { colorPalette } from '@digg/design-system';
import { Box } from '@digg/design-system';
import { Button } from '@digg/design-system';
import { CloseIcon, ArrowDropIcon } from '@digg/design-system';
import { Text } from '@digg/design-system';

const SearchFilterButton = styled(Button)`
  transition: background-color 0.25s ${props => props.theme.timings.fast};
  &:hover,
  &:focus {
    box-shadow: none;
    background-color: ${colorPalette.grey8};
    color: ${colorPalette.blackhover};
  }
`;

export interface SearchFilterViewProps {
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
    <Box bgColor="cardBg">
      <SearchFilterButton
        // className="text-6 "
        className={open ? "text-6 open" : "text-6"}
        onClick={onClick}
        textAlign="left"
        accessiblityHasPopup={true}
        accessiblityExpanded={open}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >

          <Text
            size={3}
            marginBottom={0}
            lineHeight={1.3}
            letterSpacing="0.5px"
          >
            {title || 'Öppna'}
          </Text>

          <Box >
            <ArrowDropIcon
              rotation={open ? -180 : 0}
              width={[20, 25]}
              color="#5A6751"
            />
          </Box>

        </Box>
      </SearchFilterButton>
    </Box>
    <Box
      display={open ? 'block' : 'none'}
      bgColor="card"
      padding={[2, 3, 3, 4]}
    >
      {children}
    </Box>
  </>
);
