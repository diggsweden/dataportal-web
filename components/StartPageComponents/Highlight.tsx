import { Heading, Container } from '@digg/design-system';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { MainContainerStyle } from '../../styles/general/emotion';
import { Illustration_1, Illustration_2, Illustration_3 } from '../Illustrations';

export const Highlight: React.FC = () => {
  const { t } = useTranslation('pages');
  return (
    <Container cssProp={MainContainerStyle}>
      <div className="highlight">
        <div className="highlight__illustraitons">
          <div className="illustration-container">
            <Illustration_1 />
          </div>
          <div className="illustration-container">
            <Illustration_2 />
          </div>
          <div className="illustration-container">
            <Illustration_3 />
          </div>
        </div>
        <div className="highlight__txt">
          <Heading
            level={2}
            size="xl"
          >
            {t('highlight$highlight-header')}
          </Heading>
          <p className="text-md">{t('highlight$highlight-text')}</p>
        </div>
      </div>
    </Container>
  );
};
