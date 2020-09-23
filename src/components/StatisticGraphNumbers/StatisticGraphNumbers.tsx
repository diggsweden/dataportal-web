import React from 'react';
import 'scss/statistic/statistic.scss';
import i18n from 'i18n';
import { StatisticListItemHistory } from '../StatisticListItem';
import { StatisticListItem } from '../StatisticListItem';
import { StatisticDataPresentation } from '../StatisticDataPresentation';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { isIE } from 'react-device-detect';

interface StatisticProps {
  env: EnvSettings;
}

interface StatisticState {
  children?: React.ReactNode;
  x?: any;
  y?: any;
  xList: string[];
  yList: string[];

  toSort?: any;
  topItemsToShow: number;
  screenWidth: number;
}

//Statistic
export class StatisticGraphNumbers extends React.Component<
  StatisticProps,
  StatisticState
> {
  constructor(props: StatisticProps) {
    super(props);
    this.state = {
      x: [],
      y: [],
      xList: [],
      yList: [],

      toSort: [],
      topItemsToShow: 12,
      screenWidth: 1080,
    };
  }

  updateDimensions() {
    let current = -1;
    if (typeof window !== 'undefined') {
      current = window.innerWidth;
    }
    this.setState({ screenWidth: current });
  }

  componentWillMount() {

    if (typeof fetch !== 'undefined') {
      fetch(
        this.props.env.ENTRYSCAPE_HISTORY_STATS_URL
          ? this.props.env.ENTRYSCAPE_HISTORY_STATS_URL
          : 'https://registrera.oppnadata.se/stats/historyData.json'
      )
        .then((response) => response.json())
        .then((data) => {
          let list = [];

          console.log(data)

          for (let i = 0; i < data.length; i++) {
            let item = {
              x: data[i].x.toString().substring(0, 7),
              y: data[i].y,
            };

            if (i < 12) {
              this.state.toSort.push(item);
              // list.push(item);
            }
          }

          this.setState({
            xList: this.state.toSort.map((item: any) => item.x),
            yList: this.state.toSort.map((item: any) => item.y),
          });
        });
    }
  }

  render() {
    if (isIE) {
      return <></>;
    } else {
      return (
        <div className="toplist">
          {/* Toplist */}
          <div className="statistic-toplist">
            <div className="toplist-wrapper">
              <h2 className="text-4">{i18n.t('pages|statistic|dataset-numbers')}</h2>
              <div className="top-list">
                <ol className="text-5-bold">
                  {this.state.yList &&
                    this.state.yList
                      .slice(0, this.state.topItemsToShow)
                      .map((item: any, index: any) => {
                        return (
                          <StatisticListItemHistory
                            key={'cat-' + index}
                            listText={
                              this.state.xList && this.state.xList[index]
                            }
                            listNumber={item}
                          />
                        );
                      })}
                </ol>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
