import {
  Box,
  Button,
  colorPalette,
  Container,
  Text,
} from '@digg/design-system';
import { css } from 'emotion';
import React from 'react';
import { EventEffect } from '../EventEffect';
import {
  LocalStoreContext,
  LocalStoreContextData,
} from '../LocalStoreProvider';
import { NoServerRender } from '../NoServerRender';
import { StyledLink } from '../StyledLink';

export class CookieBanner extends React.Component {
  acceptCookies = (localStore: LocalStoreContextData) =>
    localStore.set({ cookiesAccepted: true });

  render() {
    return (
      <NoServerRender>
        <LocalStoreContext.Consumer>
          {localStore => {
            return (
              !localStore.store.cookiesAccepted && (
                <Box
                  position="fixed"
                  bottom={true}
                  left
                  width="100%"
                  padding={3}
                  zIndex={100}
                  bgColor={colorPalette.grey5}
                >
                  <Container>
                    <Box className="cookie-banner" display="flex" justifyContent="center">
                      <Box
                        display="flex"
                        direction={['column', 'column', 'row']}
                        marginLeft={[0, 0, 0, 12]}
                        marginRight={[0, 0, 0, 12]}
                        maxWidth={1000}
                        justifyContent="center"
                      >
                        <div>
                          <Text weight={400} size={[3, 3, 4]} color="grey">
                            <Box
                            
                            >
                              {' '}
                              På Dataportalen använder vi kakor (cookies) för
                              att webbplatsen ska fungera på ett bra sätt för
                              dig. Genom att surfa vidare godkänner du att vi
                              använder kakor. Läs mer om <a href="#">kakor</a>.

                            </Box>
                          </Text>
                        </div>
                        <Box
                          right={true}
                          top={true}
                          flex="1"
                          display="flex"
                          justifyContent="flex-end"
                          marginLeft={6}
                          alignItems="center"
                        >
                          <EventEffect full>
                            {({ className }) => (
                              <Button
                                className={`${className} ${css`
                                  white-space: nowrap;
                                `}`}
                                primary
                                inline
                                onClick={() => this.acceptCookies(localStore)}
                              >
                                Jag förstår
                              </Button>
                            )}
                          </EventEffect>
                        </Box>
                      </Box>
                    </Box>
                  </Container>
                </Box>
              )
            );
          }}
        </LocalStoreContext.Consumer>
      </NoServerRender>
    );
  }
}
