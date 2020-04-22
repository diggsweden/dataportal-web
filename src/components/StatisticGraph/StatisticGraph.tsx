import React, { Component } from 'react';
import i18n from 'i18n';
import { StatisticListItem } from '../StatisticListItem';
import { StatisticDataPresentation } from '../StatisticDataPresentation';
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
        .then(response => response.json())
        .then(data => {
          let list = [];

          for (let i = 0; i < data.length; i++) {
            let item = {
              x: data[i].x.toString().substring(0, 7),
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
        <div>
          <h2 className="text-4">
            {i18n.t('pages|statistic|dataset-numbers')}
          </h2>
          <div className="graphbox">
            <reactvis.FlexibleXYPlot
              xType="ordinal"
              height={340}
              color="#D6D9D3"
              margin={{
                bottom: 55,
                left: 50,
                right: 20,
              }}
            >
              <reactvis.XAxis
                height={0}
                width={60}
                tickSizeOuter={0}
                style={{
                  text: { fill: '#2B2A29', fontWeight: 600 },
                }}
              />
              <reactvis.YAxis
                width={50}
                style={{
                  text: { fill: '#2B2A29', fontWeight: 600 },
                }}
              />

              <BarSeries
                className="vertical-bar-series-example"
                data={this.state.x}
              />
            </reactvis.FlexibleXYPlot>
          </div>
        </div>
      );
    }
  }
}
