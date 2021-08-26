import React from 'react';
import { Box } from '@digg/design-system';
import { PageMetadata } from 'pages/PageMetadata';
import i18n from 'i18n';

export const LoadingPage: React.FC = () => (
  <>
    <PageMetadata
      seoTitle="Laddar.."
      seoDescription=""
      seoImageUrl=""
      seoKeywords=""
      robotsFollow={true}
      robotsIndex={true}
      lang={i18n.languages[0]}
    />
    <div className="main-container">
      <Box display="flex" justifyContent="center"></Box>
    </div>
  </>
);
