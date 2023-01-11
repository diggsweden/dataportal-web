import React from "react";
import { ArrowIcon, Button, Container, Heading } from "@digg/design-system";
import { FormNavButtons, FormWrapper } from "../Styles/FormStyles";
import { useRouter } from "next/router";
import { MainContainerStyle } from "../../../styles/general/emotion";
import { Module_dataportal_Digg_Module } from "../../../graphql/__generated__/Module";
import { ContentArea } from "../../ContentArea";

export const FortroendeIntroPage: React.FC<Module_dataportal_Digg_Module> = ({
  blocks
}) => {
  const { pathname, push } = useRouter() || {};
  const intro = blocks.slice(0, 1);
  const extraInfo = blocks.slice(1);
  
  return (
    <Container cssProp={MainContainerStyle}>
      <FormWrapper>
        <Heading color="pinkPop" size={"3xl"} weight={"light"}>
          Förtroendemodellen
        </Heading>
        {intro && <ContentArea blocks={intro} />}
      </FormWrapper>

      <FormNavButtons className="start-buttons">
        <Button
          onClick={(e) =>
            e.metaKey || e.ctrlKey
              ? window.open(pathname + "/infor-utveckling", "_blank")
              : push(pathname + "/infor-utveckling")
          }
          primary
        >
          <span>
            Inför utveckling
            <ArrowIcon className="nav-icon" width={"18px"} />
          </span>
        </Button>
        <Button
          onClick={(e) =>
            e.metaKey || e.ctrlKey
              ? window.open(pathname + "/fortroende", "_blank")
              : push(pathname + "/fortroende")
          }
          primary
        >
          <span>
            Förtroendemodellen
            <ArrowIcon className="nav-icon" width={"18px"} />
          </span>
        </Button>
        <Button
          onClick={(e) =>
            e.metaKey || e.ctrlKey
              ? window.open(pathname + "/uppfoljning", "_blank")
              : push(pathname + "/uppfoljning")
          }
          primary
        >
          <span>
            Uppföljning
            <ArrowIcon className="nav-icon" width={"18px"} />
          </span>
        </Button>
      </FormNavButtons>
      <FormWrapper>
        {extraInfo && <ContentArea blocks={blocks.slice(1, 2)} />}
      </FormWrapper>
    </Container>
  );
};
