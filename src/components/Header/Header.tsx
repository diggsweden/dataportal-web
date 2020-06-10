import {
  Box,
  Container,
  createInterpolator,
  Heading,
  Logo,
  styled,
} from '@digg/design-system';
import React from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { NoScriptLogo } from '../../assets/NoScriptLogo';
import { DataportalLogo } from '../../assets/Logo';
import { EventEffect } from '../EventEffect';
import { skipToContent } from '../SkipToContent';
import i18n from 'i18n';

import 'scss/header/header.scss';
import 'scss/general/general.scss';
// import LanguageSelector from '../../components/LanguageSelector/LanguageSelector';

const hasWindow = typeof window !== 'undefined';

const frame = hasWindow
  ? window.requestAnimationFrame
  : (cb: () => void) => cb();

// const HeaderElem = Box.withComponent('header');

// const StickyElem = styled(HeaderElem)`
//   width: 100%;
//   position: fixed;
//   top: 0;
//   z-index: 2;
//   transform: translateZ(0);
//   pointer-events: none;
// `;

const InnerBox = styled(Box)`
  pointer-events: auto;
`;

const StyledHeading = styled(Heading)`
  margin-block-start: 0;
  margin-block-end: 0;
`;

const interpolate = createInterpolator({
  fromMin: 0,
  fromMax: 100,
  toMin: 0,
  toMax: 1,
});

const opacityInterpolate = createInterpolator({
  fromMin: 0,
  fromMax: 1,
  toMin: 1,
  toMax: 0,
});

const scaleInterpolate = createInterpolator({
  fromMin: 0,
  fromMax: 1,
  toMin: 1,
  toMax: 0.7,
});

const heightInterpolate = createInterpolator({
  fromMin: 0,
  fromMax: 1,
  toMin: 6.25,
  toMax: 3,
});

const inverse = createInterpolator({
  fromMin: 0,
  fromMax: 1,
  toMin: 1,
  toMax: 0,
});

interface HeadingWithRouterProps extends RouteComponentProps<{}> {
  children?: React.ReactNode;
}

const HeadingWithRouter = withRouter(
  class HeadingWithRouter extends React.PureComponent<HeadingWithRouterProps> {
    render() {
      if (this.props.location.pathname === '/') {
        return <StyledHeading level={1}>{this.props.children}</StyledHeading>;
      } else {
        return <StyledHeading tag="div">{this.props.children}</StyledHeading>;
      }
    }
  }
);

interface HeaderProps {
  activeLink?: string;
}

export class Header extends React.Component<HeaderProps> {
  private container1Ref: HTMLElement | null = null;
  private container2Ref: HTMLElement | null = null;
  private logoWordRef: SVGElement | null = null;

  private tick = false;
  private lastScrollY = 0;

  setFocusOnMenuButton() {
    skipToContent();
  }

  componentDidMount() {
    hasWindow &&
      window.addEventListener('scroll', this.handleScroll, { passive: true });
    frame(this.handleScroll);
  }

  componentWillUnmount() {
    hasWindow && window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    if (!this.tick) {
      this.tick = true;
      frame(this.onScroll);
    }
  };

  onScroll = () => {
    this.tick = false;
    let scrollY = hasWindow ? window.pageYOffset : 0;

    if (scrollY > 100) {
      scrollY = 100;
    }

    this.calculate(scrollY);
  };

  addTransitions = () => {
    if (!this.container1Ref || !this.container2Ref) return;

    this.container1Ref.addEventListener(
      'transitionend',
      this.removeTransitions
    );

    this.container1Ref.style.transition = 'height 0.2s';
    this.container2Ref.style.transition = 'height 0.2s';
  };

  removeTransitions = () => {
    if (!this.container1Ref || !this.container2Ref) return;

    this.container1Ref.style.transition = '';
    this.container2Ref.style.transition = '';
  };

  calculate = (scroll: number) => {
    const current = scroll;
    const last = this.lastScrollY;

    this.lastScrollY = current;

    if (Math.abs(last - current) > 70) {
      this.addTransitions();
    }

    const scrollValue = interpolate(scroll);
    const opacity = opacityInterpolate(scrollValue);
    const height = heightInterpolate(scrollValue);
    const scale = scaleInterpolate(scrollValue);

    frame(() => {
      if (!this.container1Ref || !this.container2Ref || !this.logoWordRef) {
        return;
      }

      this.container1Ref.style.height = `${height}rem`;
      this.container2Ref.style.height = `${height}rem`;
      this.logoWordRef.style.opacity = `${opacity}`;
      this.logoWordRef.style.transform = `translate(-${inverse(opacity || 0) *
        40}px, 0px)`;

      const link = this.container2Ref.querySelector('a');
      if (link) {
        link.style.transform = `scale(${scale})`;
      }
    });
  };

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <>
        {/* <Box height="6.25rem" /> */}
        {/* <StickyElem height="6.25rem" lang="sv"> */}
        <header>
          <InnerBox display="flex" justifyContent="center">
            <div className="beta-banner">
              <p className="text-6">
                {i18n.t('common|beta-text1')}{' '}
                <a
                  className="text-6-link"
                  target="_blank"
                  href="https://webropol.com/s/beta-sveriges-dataportal"
                  rel="noreferrer"
                >
                  {i18n.t('common|beta-link-text')}
                </a>
                {i18n.t('common|beta-text2')}
                <a
                  className="text-6-link"
                  href="https://oppnadata.se"
                  rel="noreferrer"
                >
                  oppnadata.se
                </a>
              </p>
            </div>
          </InnerBox>

          <InnerBox
            bgColor=""
            paddingY={0}
            paddingX={2}
            // height="6.25rem"
            deepRef={el => (this.container1Ref = el)}
          >
            <Container>
              <Box
                className="header-box"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                height="7.25rem"
                deepRef={el => (this.container2Ref = el)}
              >

                <EventEffect outline noHover>
                  {({ className }) => (
                    <a
                      href={`/${i18n.languages[0]}`}
                      aria-label={i18n.t('common|logo-title')}
                      style={{ transformOrigin: 'left center' }}
                      className={'dataportal-logo'}
                    >
                      <Box maxWidth={['18rem', '25rem']}>
                        <div className="logo-box">
                          <DataportalLogo />
                        </div>
                      </Box>
                    </a>
                  )}
                </EventEffect>

                {/* <LanguageSelector /> */}
                <div className="lang-select">
                  <a className="text-7" href={ i18n.t('common|language').includes('english') ? '/en' : '/sv'}>{i18n.t('common|language')}</a>
                </div>

                <div className="header-links">
                  <div>
                    <a
                      className={
                        'header-link ' +
                        (this.props.activeLink == 'search' ||
                        this.props.activeLink == 'terms' ||
                        this.props.activeLink == 'specifications'
                          ? 'active'
                          : '')
                      }
                      href={`/${i18n.languages[0]}/${i18n.t(
                        'routes|datasets|path'
                      )}?q=&f=`}
                    >
                      {i18n.t('common|search-data')}
                    </a>
                  </div>
                  <div>
                    <a
                      href={`/${i18n.languages[0]}/${i18n.t(
                        'routes|register-data|path'
                      )}`}
                      className={
                        'header-link ' +
                        (this.props.activeLink == 'register' ? 'active' : '')
                      }
                    >
                      {i18n.t('routes|register-data|title')}
                    </a>
                  </div>
                </div>
              </Box>
            </Container>
          </InnerBox>
        </header>
      </>
    );
  }
}
