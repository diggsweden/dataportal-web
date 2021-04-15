import React, { useState, useEffect } from 'react';
import i18n from 'i18n';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { isIE } from 'react-device-detect';
import '../../../node_modules/react-vis/dist/style.css';
import { Link } from 'react-router-dom';
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



export const StatisticGraph: React.FC<StatisticGraphProps> = (props) => {

  const [stats, setStats] = useState<StatisticGraphState>({
        useCanvas: false,
        x: [],
        y: [],
        screenWidth: 1080,
        publishers: 151,
        datasets: 2180,
      })

  const updateDimensions = () => {
    let current = -1;
    if (typeof window !== 'undefined') {
      current = window.innerWidth;
    }
    setStats(prev => { 
      return {
        ...prev, 
        screenWidth: current }
      });
  }

    useEffect(() => {
      if (typeof fetch !== 'undefined') {
          fetch(
            props.env.ENTRYSCAPE_HISTORY_STATS_URL
              ? props.env.ENTRYSCAPE_HISTORY_STATS_URL
              : 'https://admin.dataportal.se/stats/historyData.json'
          )
            .then((response) => response.json())
            .then((data) => {
              
              let list: { x: any; y: any; }[] = [];
    
              for (let i = 0; i < data.length; i++) {
                let item = {
                  x: data[i].x.toString().substring(2, 7),
                  y: data[i].y,
                };
    
                if (i < 19) {
                  list.push(item);
                }
              }
              setStats(prev => { return {
                ...prev,
                x: list.reverse()
              }})
            });
        }
    },[])

    if (isIE) {
      return <></>;
    } else {
      const reactvis = require('react-vis');

      const useCanvas = stats.useCanvas;
      const content = useCanvas ? 'TOGGLE TO SVG' : 'TOGGLE TO CANVAS';
      const BarSeries = useCanvas
        ? reactvis.VerticalBarSeriesCanvas
        : reactvis.VerticalBarSeries;

      const labelData = stats.x.map((d: any, idx: any) => ({
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
              color="#889787"
              margin={{
                bottom: 64,
                left: 70,
                right: 15,
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
                data={stats.x}
              />
            </reactvis.FlexibleXYPlot>
            <span className="graph-text text-5">
              {i18n.t('pages|statistic|dataset-numbers')}
            </span>
          </div>
          <Link to={`/${i18n.languages[0]}/${i18n.t('routes|statistics|path')}`} className="text-5">
          {i18n.t('pages|statistic|statistic-link')}
          </Link>
        </div>
        
      );    
    
  }
}
