import React from 'react';
import { AnchorLink } from './AnchorLink';
import { styled, colorPalette } from '@digg/design-system';
import { SettingsContext } from '../../components/SettingsProvider';
import { isEdge } from '../../utilities/detectBrowser';
import i18n from 'i18n';

export interface MenuItem {
  id: string;
  text: string;
}

interface AnchorLinkMenuProps {
  menuItems: MenuItem[];
  screenWidth: number;
  anchorLinkMenuRef?: React.RefObject<HTMLDivElement>;
}

interface WatchedItem {
  isActive: boolean;
  element: HTMLElement;
}

interface AnchorLinkMenuState {
  latestActiveItem: WatchedItem | null;
}

export class AnchorLinkMenu extends React.Component<
  AnchorLinkMenuProps,
  AnchorLinkMenuState
> {
  private timer: number = 0;

  private watch() {
    const { menuItems } = this.props;
    isEdge && this.setPosition(this.props.anchorLinkMenuRef); // fix position bug in edge
    let watchedItems: WatchedItem[] = [];
    menuItems.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) {
        watchedItems.push({
          isActive: this.isInView(element),
          element,
        });
      }
    });

    const latestActiveItem = watchedItems.find(item => item.isActive) || null;

    if (latestActiveItem != null) {
      this.setState({ latestActiveItem: latestActiveItem });
    }
  }

  /**
   * sets position fixed or sticky (only because sticky does not work properly in edge-legacy)
   * @param {React.RefObject<HTMLDivElement>} ref the div that encapsels the anchorlinkMenu
   * @memberof AnchorLinkMenu
   */
  private setPosition = (ref?: React.RefObject<HTMLDivElement>) => {
    const bottom = document.documentElement.getBoundingClientRect().bottom;
    const scrollTtop = document.body.scrollTop;
    const setStyles = (topOrBottom: boolean) => {
      if (ref && ref.current) {
        ref.current.style.position = topOrBottom ? 'sticky' : 'fixed';
        ref.current.style.right = topOrBottom ? '0' : '5%';
      }
    };
    ref &&
    ref.current &&
    this.props.screenWidth > 899 &&
    scrollTtop > 360 &&
    bottom > 1200
      ? setStyles(false)
      : setStyles(true);
  };

  private isInView = (element: HTMLElement) => {
    if (typeof window !== 'undefined') {
      const rect = element.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= window.innerHeight;
    }
    return false;
  };

  constructor(props: AnchorLinkMenuProps) {
    super(props);

    this.state = {
      latestActiveItem: null,
    };
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      this.timer = window.setInterval(() => this.watch(), 100);
    }
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.clearInterval(this.timer);
    }
  }

  render() {
    const { menuItems, screenWidth } = this.props;

    const AnchorHeadingBox = styled('div')`
      h2 {
        margin-top: 0px;
        margin-bottom: 16px;
      }
    `;

    const AnchorHeading = styled('h2')`
      font-size: 20px;
      font-weight: bold;
      line-height: 28px;
      letter-spacing: -0.01em;
      color: ${colorPalette.black100};
    `;

    return (
      <SettingsContext.Consumer>
        {( settings ) => (
          <>
            {menuItems.length > 1 && (
              <>
                <AnchorHeadingBox>
                  <AnchorHeading aria-hidden id="anchorLinkHeading">
                  {i18n.t('common|contentonthispage')}
                  </AnchorHeading>
                </AnchorHeadingBox>

                <nav
                  aria-labelledby="anchorLinkHeading"
                  className="anchorLinks"
                >
                  {menuItems.map((menuItem, key) => {
                    const latestWathedItem = this.state.latestActiveItem;
                    let isActive =
                      latestWathedItem != null &&
                      screenWidth > 899 &&
                      menuItem.id === latestWathedItem.element.id;

                    return (
                      <AnchorLink
                        key={key}
                        href={`#${menuItem.id}`}
                        text={menuItem.text}
                        active={isActive}
                      />
                    );
                  })}
                </nav>
              </>
            )}
          </>
        )}
      </SettingsContext.Consumer>
    );
  }
}
