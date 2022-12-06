import React from 'react'
import { Heading, Button, css } from '@digg/design-system';
import { DiggTextWithLink } from '../Styles/FormStyles';
import ExternalLink from '../../Navigation/ExternalLink';

interface Props {
    setPage: React.Dispatch<React.SetStateAction<number>>;
    page: number;
}

export const FortroendeIntroPage: React.FC<Props> = ({setPage, page}) => {
  return (
    <div>
      <Heading level={2}>Inledning</Heading>
      <p className="text-base">
        Förtroendemodellen för artificiell intelligens (AI) är ett självuppskattningsverktyg med ett
        antal syften. Det främsta syftet är att bevara, och till och med öka, den öppenhet och
        transparens som finns inom svensk offentlig förvaltning. En ifylld förtroendemodell ska som
        huvudregel kunna visa upp för tillsynsmyndigheter och intresserad allmänhet. Genom att
        använda förtroendemodellen får även du som vill använda AI i din verksamhet en ökad trygghet
        om regler och förhållningssätt som behöver beaktas vid användningen av AI beaktas. Därmed
        kan förtroendemodellen även tjäna den interna verksamhetsutvecklingen.
      </p>

      <Heading level={2}>Hur ni använder förtroendemodellen</Heading>
      <p className="text-base">
        Förtroendemodellen ska inte uppfattas som heltäckande eller en garant för att ert AI-system
        uppfyller alla krav, regler och rekommendationer. Använd istället förtroendemodellen som ett
        stöd.
        <br />
        <br />
        En tvärfunktionell grupp bestående av personer som kan både verksamheten, tekniken,
        juridiken och organisationen bör tillsammans fylla i förtroendemodellen. Gruppen bör inte
        vara allt för homogen, utan kunna bidra med olika perspektiv. Använd gärna en oberoende
        facilitator som inför ifyllandet läser in sig på *relevanta delar av AI-guiden*. <br />
        <br />
        Den första delen av förtroendemodellen fyller ni i inför utveckling – syftet med denna är
        att lyfta relevanta frågor för att förstå risker och konsekvenser och kunna göra medvetna
        val i utformningen av AI-lösningen. <br />
        <br />
        Den andra delen av förtroendemodellen fyller ni i inför driftsättning – syftet med denna är
        att dokumentera för att kunna visa upp hur AI-lösningen är utformad. <br />
        <br />
        Det rekommenderas att ni sparar den nedladdade filen, och arkiverar den som allmän handling,
        så att den är enkelt tillgänglig för den som vill veta mer om AI-systemet.
      </p>

      <Heading level={2}>Bakgrund</Heading>
      <div className="text-base">
        Förtroendemodellen är framtagen i enlighet med regeringsuppdraget{' '}
        <ExternalLink href="https://www.regeringen.se/4a659e/contentassets/8f82d9202b3448e4a946f28bce5b8bba/uppdrag-om-att-testa-ny-teknik-vid-automatisering-inom-offentlig-forvaltning.pdf">
          Uppdrag om att testa ny teknik vid automatisering inom offentlig förvaltning
        </ExternalLink>{' '}
        (regeringen.se) av Myndigheten för digital förvaltning (Digg) och
        Lantmäterietoch utvecklad i enlighet med regeringsuppdraget {' '}
        <ExternalLink href="https://www.regeringen.se/49e284/contentassets/fd078181a7614601845f5439efcafe81/uppdrag-att-framja-offentlig-forvaltnings-formaga-att-anvanda-artificiell-intelligens">
        Uppdrag att främja offentlig
        förvaltnings förmåga att använda artificiell intelligens
        </ExternalLink>{' '}
        (regeringen.se) av Arbetsförmedlingen, Bolagsverket, Myndigheten för digital förvaltning (Digg),
        Lantmäteriet och Skatteverket med stöd av Integritetsskyddsmyndigheten, Statskontoret och
        XXXX
      </div>

      <Button
        primary
        onClick={() => {
          setPage(page + 1);
          window.scrollTo(0, 0);
        }}
        css={css`
          margin: 3rem 0;
          width: 13rem;
        `}
      >
        Starta utvärdering
      </Button>
    </div>
  );
}

export default FortroendeIntroPage;