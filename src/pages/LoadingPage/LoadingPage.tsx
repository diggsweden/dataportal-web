import { Box, Container, Spinner, Text, themes } from '@digg/design-system';
import { ThemeProvider } from 'emotion-theming';
import React from 'react';

export const LoadingPage: React.SFC = () => (
  <ThemeProvider theme={themes.red}>
    <Container>
      <Box
        bgColor="background"
        paddingX={[2, 4]}
        paddingY={2}
        marginTop={[2, 4]}
        marginBottom={4}
        minHeight="30vh"
      >
        <Box
          display="flex"
          direction="column"
          justifyContent="center"
          alignItems="center"
          paddingY={4}
        >
          <Box marginTop={3} marginBottom={1}>
            <Spinner />
          </Box>
          <Text>Laddar...</Text>
        </Box>
      </Box>
    </Container>
  </ThemeProvider>
);
