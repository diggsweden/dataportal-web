import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import React, { useState, useEffect, useContext } from 'react';
import { SettingsContext } from '..';
import {
  XAxis,
  YAxis,
  FlexibleXYPlot,
  VerticalBarSeriesCanvas,
  VerticalBarSeries,
} from 'react-vis';

interface StatisticGraphState {
  useCanvas?: boolean;
  x?: any;
  y?: any;
  screenWidth: number;
  publishers?: number;
  datasets?: number;
}

export const StatisticGraph: React.FC = () => {
  const { env } = useContext(SettingsContext);

  const { t, lang } = useTranslation();
  const [stats, setStats] = useState<StatisticGraphState>({
    useCanvas: false,
    x: [],
    y: [],
    screenWidth: 1080,
    publishers: 151,
    datasets: 2180,
  });

  useEffect(() => {
    if (typeof fetch !== 'undefined') {
      fetch(
        env.ENTRYSCAPE_HISTORY_STATS_URL
          ? env.ENTRYSCAPE_HISTORY_STATS_URL
          : 'https://admin.dataportal.se/stats/historyData.json'
      )
        .then((response) => response.json())
        .then((data) => {
          let list: { x: any; y: any }[] = [];

          for (let i = 0; i < data.length; i++) {
            let item = {
              x: data[i].x.toString().substring(2, 7),
              y: data[i].y,
            };

            if (i < 19) {
              list.push(item);
            }
          }
          setStats((prev) => {
            return {
              ...prev,
              x: list.reverse(),
            };
          });
        });
    }
  }, []);

  const useCanvas = stats.useCanvas;
  const BarSeries = useCanvas ? VerticalBarSeriesCanvas : VerticalBarSeries;

  return (
    <div className="statistic-div">
      <span className="screen-reader">{t('pages|statistic$statistic-screenreader')}</span>

      <div className="graphbox">
        {/* @ts-ignore */}
        <FlexibleXYPlot
          xType="ordinal"
          height={430}
          color="#889787"
          margin={{
            bottom: 64,
            left: 70,
            right: 15,
          }}
        >
          <XAxis
            height={0}
            tickSizeOuter={0}            
            style={{
              text: { fill: '#2B2A29', color:'#2B2A29', fontWeight: 500 },
            }}
          />
          <YAxis
            width={64}
            style={{
              text: { fill: '#2B2A29', color:'#2B2A29', fontWeight: 500 },
            }}
          />
          {/* @ts-ignore */}
          <BarSeries
            className="vertical-bar-series-example"
            data={stats.x}
            barWidth={0.85}                        
          />
        </FlexibleXYPlot>
        <span className="graph-text text-md">{t('pages|statistic$dataset-numbers')}</span>
      </div>
      <Link
        href={`/${lang}/${t('routes|statistics$path')}`}
        locale={lang}
      >
        <a className="text-md">{t('pages|statistic$statistic-link')}</a>
      </Link>
    </div>
  );
};

export default StatisticGraph;
