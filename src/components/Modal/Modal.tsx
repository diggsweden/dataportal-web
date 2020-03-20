import { Box, colorPalette, Container, styled } from '@digg/design-system';
import { keyframes } from 'emotion';
import FocusTrap from 'focus-trap-react';
import React from 'react';

const bgAnimation = keyframes`
  from {
    transform: scale(1, 0.6);
    opacity: 0;
  }
`;

const wrapperAnimation = keyframes`
  from {
    opacity: 0;
  }
`;

const innerAnimation = keyframes`
  to { 
    transform: translateY(0);
    opacity: 1;
  }
`;

const Wrapper = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  padding: 4rem;
  z-index: 2;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(105, 96, 89, 0.7);
    opacity: 1;
    animation ${wrapperAnimation} 1s ${props => props.theme.timings.fast};
  }

  @media screen and (max-width: 50em) {
    padding: 0;
  }
`;

const Inner = styled(Box)`
  overflow: auto;
  animation: ${innerAnimation} 0.4s 0.1s ${props => props.theme.timings.fast}
    forwards;
  transform-origin: 0 0;
  will-change: transform, opacity;
  transform: translateY(-40px);
  opacity: 0;
`;

const Background = styled(Box)`
  animation: ${bgAnimation} 0.3s ${props => props.theme.timings.fast};
  transform-origin: 0 0;
  will-change: transform, opacity;
`;

const ChildWrapper = styled(Box)`
  will-change: transform;
`;

export type ModalProps = {
  active: boolean;
  label: string;
  onClose: () => void;
};

export class Modal extends React.Component<ModalProps> {
  keyDown = (ev: React.KeyboardEvent<any>) => {
    if (ev.keyCode === 27) {
      if (this.props.onClose) {
        this.setRootOverflow(false);
        this.props.onClose();
      }
    }
  };

  componentDidUpdate() {
    this.setRootOverflow(this.props.active);
  }

  shouldComponentUpdate(prevProps: ModalProps) {
    return this.props.active !== prevProps.active;
  }

  setRootOverflow = (hidden: boolean) => {
    const rootElement =
      typeof document !== 'undefined' ? document.querySelector('html') : null;

    if (rootElement) {
      rootElement.style.overflow = hidden ? 'hidden' : '';
    }
  };

  bgClick = (ev: React.MouseEvent<any>) => {
    this.setRootOverflow(false);
    this.props.onClose();
  };

  innerClick = (ev: React.MouseEvent<any>) => {
    this.setRootOverflow(false);
    ev.stopPropagation();
  };

  render() {
    const { active } = this.props;

    return (
      <Box display={active ? 'block' : 'none'}>
        <FocusTrap active={active} onKeyDown={this.keyDown}>
          <Wrapper
            role="dialog"
            aria-label={this.props.label}
            onClick={this.bgClick}
          >
            <Container wrapperProps={{ maxHeight: '100%' }}>
              <Inner width="100%" maxHeight="100%" onClick={this.innerClick}>
                <Box position="relative" paddingBottom={4}>
                  <Background
                    position="absolute"
                    top
                    right
                    bottom
                    left
                    bgColor={colorPalette.red5}
                  />
                  <ChildWrapper position="relative">
                    {this.props.children}
                  </ChildWrapper>
                </Box>
              </Inner>
            </Container>
          </Wrapper>
        </FocusTrap>
      </Box>
    );
  }
}
