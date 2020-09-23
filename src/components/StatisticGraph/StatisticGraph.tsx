import React, { Component } from 'react';
import i18n from 'i18n';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { isIE } from 'react-device-detect';
import '../../../node_modules/react-vis/dist/style.css';
// import {XYPlot, LineSeries} from 'react-vis';

interface StatisticGraphProps {
  env: EnvSettings;
}

interface StatisticGraphState {
  useCanvas?: boolean;
  x?: any;
  y?: any;
  screenWidth: number;
  publishers?: number;
  datasets?: number;
}

export class StatisticGraph extends React.Component<
  StatisticGraphProps,
  StatisticGraphState
> {
  constructor(props: StatisticGraphProps) {
    super(props);
    this.state = {
      useCanvas: false,
      x: [],
      y: [],
      screenWidth: 1080,
      publishers: 151,
      datasets: 2180,
    };
  }

  // updateDimensions() {
  //   let current = -1;
  //   if (typeof window !== 'undefined') {
  //     current = window.innerWidth;
  //   }
  //   this.setState({ screenWidth: current });
  // }

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

          for (let i = 0; i < data.length; i++) {
            let item = {
              x: data[i].x.toString().substring(2, 7),
              y: data[i].y,
            };

            if (i < 12) {
              list.push(item);
            }
          }
          this.setState({ x: list.reverse() });
        });
    }
  }

  render() {
    if (isIE) {
      return <></>;
    } else {
      const reactvis = require('react-vis');

      const useCanvas = this.state.useCanvas;
      const content = useCanvas ? 'TOGGLE TO SVG' : 'TOGGLE TO CANVAS';
      const BarSeries = useCanvas
        ? reactvis.VerticalBarSeriesCanvas
        : reactvis.VerticalBarSeries;

      const labelData = this.state.x.map((d: any, idx: any) => ({
        x: d.x,
        y: d.y,
      }));

      return (
        <div className="statistic-div">
          <span className="screen-reader">
          {i18n.t('pages|statistic|statistic-screenreader')}
          </span>

          <div className="graphbox">
            <reactvis.FlexibleXYPlot
              xType="ordinal"
              height={430}
              color="#ACB3A8"
              margin={{
                bottom: 64,
                left: 70,
                right: 0,
              }}
            >
              <reactvis.XAxis
                height={0}
                tickSizeOuter={0}
                style={{
                  text: { fill: '#2B2A29', fontWeight: 500 },
                }}
              />
              <reactvis.YAxis
                width={64}
                style={{
                  text: { fill: '#2B2A29', fontWeight: 500 },
                }}
              />
              <BarSeries
                className="vertical-bar-series-example"
                data={this.state.x}
              />
            </reactvis.FlexibleXYPlot>
            <span className="graph-text text-5">
              {i18n.t('pages|statistic|dataset-numbers')}
            </span>
          </div>
          <a href={`/${i18n.languages[0]}/${i18n.t('pages|statistic|statistic-page-link')}`} className="text-5">
          {i18n.t('pages|statistic|statistic-link')}
          </a>
        </div>
      );
    }
  }
}
