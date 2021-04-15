import React, { useEffect, useState } from 'react';
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

export const StatisticGraphNumbers: React.FC<StatisticProps> = (props) => {

  const [stats, setStats] = useState<StatisticState>({
    x: [],
    y: [],
    xList: [],
    yList: [],
    toSort: [],
    topItemsToShow: 19,
    screenWidth: 1080,
  });

  useEffect(() => {
    if (typeof fetch !== 'undefined') {
        fetch(
          props.env.ENTRYSCAPE_HISTORY_STATS_URL
            ? props.env.ENTRYSCAPE_HISTORY_STATS_URL
            : 'https://admin.dataportal.se/stats/historyData.json'
        )
          .then((response) => response.json())
          .then((data) => {
            let list = [];
  
            for (let i = 0; i < data.length; i++) {
              let item = {
                x: data[i].x.toString().substring(0, 7),
                y: data[i].y,
              };
  
              if (i < 19) {
                stats.toSort.push(item);
                // list.push(item);
              }
            }
           
            setStats(prev => { 
              return {
                ...prev, 
                xList: stats.toSort.map((item: any) => item.x),
                yList: stats.toSort.map((item: any) => item.y),
              }});
          });
    }
  },[])
  
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
                  {stats.yList &&
                    stats.yList
                      .slice(0, stats.topItemsToShow)
                      .map((item: any, index: any) => {
                        return (
                          <StatisticListItemHistory
                            key={'cat-' + index}
                            listText={
                              stats.xList && stats.xList[index]
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
