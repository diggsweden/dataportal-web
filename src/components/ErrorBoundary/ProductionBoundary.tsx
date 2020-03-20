import {
  Box,
  colorPalette,
  Container,
  Heading,
  Text,
} from '@digg/design-system';
import React from 'react';
import { ErrorBoundaryProps } from './ErrorBoundary';

export const ProductionBoundary: React.SFC<ErrorBoundaryProps> = () => (
  <Box flex="1 0 100%">
    <Container>
      <Box maxWidth="50em" marginTop={3} marginBottom={2}>
        <Heading level={1} color={colorPalette.orange1} marginBottom={2}>
          Whoops! Något har gått fel.
        </Heading>
        <Text>Testa att ladda om din webbläsare</Text>
      </Box>
    </Container>
  </Box>
);
