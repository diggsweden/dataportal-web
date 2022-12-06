import React from 'react';
import { ArrowIcon, Button, Container, Heading } from '@digg/design-system';
import { FormNavButtons, FormWrapper } from '../Styles/FormStyles';
import { useRouter } from 'next/router';
import { MainContainerStyle } from '../../../styles/general/emotion';
import { Module_dataportal_Digg_Module } from '../../../graphql/__generated__/Module';
import { ContentArea } from '../../ContentArea';

export const FortroendeIntroPage: React.FC<Module_dataportal_Digg_Module> = ({ blocks }) => {
  const { pathname } = useRouter() || {};
  const router = useRouter();
  
  return (
    <Container cssProp={MainContainerStyle}>
      <FormWrapper>
        <Heading
          color="pinkPop"
          size={'3xl'}
          weight={'light'}
        >
          Förtroendemodellen
        </Heading>
        <ContentArea blocks={blocks} />
      </FormWrapper>
      <FormNavButtons className="start-buttons">
        <Button
          onClick={() => router.push(pathname + '/infor-utveckling')}
          primary
        >
           <span>
            Inför utveckling
            <ArrowIcon
              className="nav-icon"
              width={'18px'}
            />
          </span>
       </Button>
        <Button
          onClick={() => router.push(pathname + '/fortroende')}
          primary
        >
          <span>
            Förtroendemodellen
            <ArrowIcon
              className="nav-icon"
              width={'18px'}
            />
          </span>
        </Button>
        <Button
          onClick={() => router.push(pathname + '/uppfoljning')}
          primary
        >
          <span>
            Uppföljning
            <ArrowIcon
              className="nav-icon"
              width={'18px'}
            />
          </span>
        </Button>
      </FormNavButtons>
    </Container>
  );
};