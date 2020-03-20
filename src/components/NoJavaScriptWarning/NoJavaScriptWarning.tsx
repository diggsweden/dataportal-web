import React from 'react';
import { Box, Text, colorPalette } from '@digg/design-system';
import { SettingsContext } from 'components/SettingsProvider';

export interface NoJavaScriptWarningProps {
  text: string;
}

export const NoJavaScriptWarning: React.SFC<
  NoJavaScriptWarningProps
> = props => (
  <noscript>
    <Box
      position="fixed"
      bottom
      left
      width="100%"
      bgColor={colorPalette.orange3}
      padding={3}
      zIndex={100}
    >
      <SettingsContext.Consumer>
        {({ noScriptContent }) => (
          <Text size={4} align="center">
            {noScriptContent}
          </Text>
        )}
      </SettingsContext.Consumer>
    </Box>
  </noscript>
);
