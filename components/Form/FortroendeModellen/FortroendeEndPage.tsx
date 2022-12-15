import React from 'react';
import { MainContainerStyle } from '../../../styles/general/emotion';
import { Module_dataportal_Digg_Module } from '../../../graphql/__generated__/Module';
import { ContentArea } from '../../ContentArea';
import { Heading, Container } from '@digg/design-system';
import { FormWrapper } from '../Styles/FormStyles';

export const FortroendeEndPage: React.FC<Module_dataportal_Digg_Module> = ({ blocks }) => {
  return (
    <Container cssProp={MainContainerStyle}>
      <FormWrapper>
        <Heading color="pinkPop" size={"3xl"} weight={"light"}>
          Tack för att du tog dig tid att fylla i formuläret!
        </Heading>
        <ContentArea blocks={blocks} />

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

        <code>
          <pre>
            {`
              <a
                href="https://dataportalen.se"
                target="_blank"
                data-wpel-link="external"
                rel="external noopener noreferrer"
              >
                <img
                  width="200px"
                  src="https://diggdrstoragetest.blob.core.windows.net/strapi-dataportal2-beta/assets/illu_start_2_0_d48c342ac2.svg"
                  alt="Förtroendemodellen logo badge"
                />
              </a>`}
          </pre>
        </code>
      </FormWrapper>
    </Container>
  );
};
