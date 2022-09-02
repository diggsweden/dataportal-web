import React from 'react';
import { DevportalIllustration } from '../Illustrations';
import useTranslation from 'next-translate/useTranslation';
import { Heading, Container } from '@digg/design-system';
import { MainContainerStyle } from '../../styles/general/emotion';

export const DevportalBlock: React.FC = () => {
  const { lang } = useTranslation();
  return (
    <div>
      {lang.toLowerCase() === 'sv' || lang.toLowerCase() === 'sv-se' ? (
        <Container cssProp={MainContainerStyle}>
          <div className="devportalblock">
            <div className="devportalblock-left-col">
              <Heading
                level={2}
                size={'xl'}
              >
                Lär dig mer om API-hantering på Utvecklarportalen
              </Heading>
              <p className="text-md">
                Ta del av rekommendationer för hur den offentliga sektorn ska arbeta med utveckling
                av API:er. En första version av en nationell REST API profil finns publicerad på
                webbplatsen samt en <span lang="en">API-Playbook</span>.
              </p>
              <a
                className="text-md link external-link-icon"
                href="https://dev.dataportal.se/"
              >
                Till Utvecklarportalen
              </a>
            </div>
            <div className="devportalblock-right-col">
              <DevportalIllustration />
            </div>
          </div>
        </Container>
      ) : (
        ''
      )}
    </div>
  );
};
