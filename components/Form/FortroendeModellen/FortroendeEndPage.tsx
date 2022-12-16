import React, { useEffect } from 'react';
import { MainContainerStyle } from '../../../styles/general/emotion';
import { Module_dataportal_Digg_Module } from '../../../graphql/__generated__/Module';
import { ContentArea } from '../../ContentArea';
import { Heading, Container, css } from '@digg/design-system';
import { FormWrapper } from '../Styles/FormStyles';
import { highlightCode, highlightCodeBlock } from '../../pages/Articles';

export const FortroendeEndPage: React.FC<Module_dataportal_Digg_Module> = ({ blocks }) => {
  useEffect(() => {
    //Highlight code blocks using prismjs
    highlightCode();
  }, []);
  
  return (
    <Container cssProp={MainContainerStyle}>
      <FormWrapper>
        <Heading color="pinkPop" size={"3xl"} weight={"light"}>
          Tack för att du tog dig tid att fylla i formuläret!
        </Heading>
        <span className="content">
          <ContentArea blocks={blocks} />
        </span>

        <div css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 2rem;
        `}>
          <a
            href="https://dataportalen.se"
            target="_blank"
            data-wpel-link="external"
            rel="external noopener noreferrer"
          >
            <img
              width="200px"
              src="https://diggdrstoragetest.blob.core.windows.net/strapi-dataportal2-beta/assets/illu_start_2_0_d48c342ac2.svg"
              alt="Fortroendemodellen logo badge"
            />
          </a>
        </div>
      </FormWrapper>
    </Container>
  );
};
