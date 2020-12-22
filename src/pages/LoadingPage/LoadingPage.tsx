import React from 'react';
import { Box } from '@digg/design-system';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Loader } from '../../components/Loader';

const MainContent = Box.withComponent('main');

export const LoadingPage: React.SFC = () => (
  <Box
    id="top"
    display="flex"
    direction="column"
    minHeight="101vh"
    bgColor="#fff"
    className="notfoundpage"
  >
    <Header />
    <MainContent flex="1 1 auto">
      <div className="main-container">
        <Box display="flex" justifyContent="center">
        </Box>
      </div>
    </MainContent>
    <Footer onToTopButtonPushed={() => {}} />
  </Box>
);
