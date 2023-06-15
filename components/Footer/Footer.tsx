import { Container, css, DiggLogo, Heading, space } from '@digg/design-system';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { Footer_dataportal_v1_Digg_Footer_columns } from '../../graphql/__generated__/Footer';
import { renderMarkdown } from '../Renderers';
import Image from "next/image";
import euLogo from "../../public/images/eu.png";

export interface FooterProps {
  columns: (Footer_dataportal_v1_Digg_Footer_columns | null)[];
}

export const Footer: React.FC<FooterProps> = ({ columns }) => {
  const { t } = useTranslation('common');
  return (
    <footer
      className="footer"
      css={css`
        ${space({ px: 4 })}
      `}
    >
      <Container>
        <div className="footer-main">
          <div className="footer__links">
            <div className="footer__links-nav">
              {columns?.map((col, index) => (
                <div
                  key={index}
                  className="footer__column"
                >
                  <Heading
                    level={2}
                    size="md"
                    className="footer__links-nav--heading"
                  >
                    {col?.title}
                  </Heading>
                  {renderMarkdown(col?.text?.markdown || '')}
                </div>
              ))}
            </div>
          </div>

          <div className="digg__">
            <div className="footer__logos">
              <div className="footer__logos-digg">
                <DiggLogo
                  title={t('common|digg-logo_text')}
                  id="footer"
                  mode="wide"
                  width={30 * 16}
                />
              </div>
              <Image
                src={euLogo}
                alt=""
                width={200}
                height={50}
                priority={true}
              />
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};
