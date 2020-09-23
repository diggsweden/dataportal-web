import React from 'react';
import 'scss/statistic/statistic.scss';
import i18n from 'i18n';
import { StatisticListItem } from '../StatisticListItem';
import { StatisticDataPresentation } from '../StatisticDataPresentation';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { isIE } from 'react-device-detect';

interface StatisticProps {
  env: EnvSettings;
}

interface StatisticState {
  children?: React.ReactNode;
  labels?: string[];
  series?: any;
  values?: any;
  publishers?: number;
  datasets?: number;
  concepts?: number;
  terminologies?: number;
  specifications?: number;
  labelsTheme?: string[];
  seriesTheme?: string[];
  valuesTheme?: string[];
  toSort?: any;
  topItemsToShow: number;
  screenWidth: number;
}

//Statistic
export class Statistic extends React.Component<StatisticProps, StatisticState> {
  constructor(props: StatisticProps) {
    super(props);
    this.state = {
      publishers: 151,
      datasets: 2180,
      concepts: 111,
      terminologies: 222,
      specifications: 333,
      labels: [],
      series: [],
      values: [],
      labelsTheme: [],
      seriesTheme: [],
      valuesTheme: [],
      toSort: [],
      topItemsToShow: 5,
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
        this.props.env.ENTRYSCAPE_ORG_STATS_URL
          ? this.props.env.ENTRYSCAPE_ORG_STATS_URL
          : 'https://registrera.oppnadata.se/charts/orgData.json'
      )
        .then((response) => response.json())
        .then((data) => {
          if (data && data.datasetCount && data.publisherCount)
            this.setState({
              publishers: data.publisherCount,
              datasets: data.datasetCount,
              labels: data.labels,
              series: data.series[0],
              values: data.values,
            });
        });
 
      fetch(
        this.props.env.ENTRYSCAPE_CONCEPT_STATS_URL
          ? this.props.env.ENTRYSCAPE_CONCEPT_STATS_URL
          : 'https://editera.dataportal.se/stats/entityData.json'
      )
        .then((response) => response.json())
        .then((data) => {
          if (
            data &&
            data.concepts &&
            data.terminologies &&
            data.specifications
          )
            this.setState({
              concepts: data.concepts,
              terminologies: data.terminologies,
              specifications: data.specifications,
            });
        });

      let url = 'https://registrera.oppnadata.se/charts/themeData.json';

      if (
        this.props.env.ENTRYSCAPE_THEME_STATS_URL_EN &&
        i18n.languages[0] != 'sv'
      ) {
        url = this.props.env.ENTRYSCAPE_THEME_STATS_URL_EN;
      } else if (this.props.env.ENTRYSCAPE_THEME_STATS_URL) {
        url = this.props.env.ENTRYSCAPE_THEME_STATS_URL;
      }

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          for (let i = 0; i < data.labels.length; i++) {
            let item = {
              label: data.labels[i],
              serie: data.series[i],
              value: data.values[i],
            };

            this.state.toSort.push(item);
          }

          this.state.toSort.sort(function (a: any, b: any) {
            return b.serie - a.serie;
          });

          this.setState({
            labelsTheme: this.state.toSort.map((item: any) => item.label),
            seriesTheme: this.state.toSort.map((item: any) => item.serie),
            valuesTheme: this.state.toSort.map((item: any) => item.value),
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
              <h2 className="text-4">
                {i18n.t('pages|statistic|top')} {this.state.topItemsToShow}{' '}
                {i18n.t('pages|statistic|top-organizations')}
              </h2>

              <div className="top-list">
                <ol key={'toplist-organisation'} className="text-5-bold">
                  {this.state.series
                    .slice(0, this.state.topItemsToShow)
                    .map((item: any, index: any) => {
                      return (
                        <StatisticListItem
                          key={'org-' + index}
                          listText={
                            this.state.labels && this.state.labels[index]
                          }
                          listNumber={item}
                          listUrl={`/${
                            i18n.languages[0]
                          }/datasets?f=http%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fpublisher%7C%7C${
                            this.state.values &&
                            encodeURIComponent(this.state.values[index])
                          }%7C%7Cfalse%7C%7Curi%7C%7COrganisationer%7C%7C${
                            this.state.labels && this.state.labels[index]
                          }`}
                        />
                      );
                    })}
                </ol>
              </div>
            </div>

            <div className="toplist-wrapper">
              <h2 className="text-4">
                {i18n.t('pages|statistic|top')} {this.state.topItemsToShow}{' '}
                {i18n.t('pages|statistic|top-categories')}
              </h2>

              <div className="top-list">
                <ol className="text-5-bold">
                  {this.state.seriesTheme &&
                    this.state.seriesTheme
                      .slice(0, this.state.topItemsToShow)
                      .map((item: any, index: any) => {
                        return (
                          <StatisticListItem
                            key={'cat-' + index}
                            listText={
                              this.state.labelsTheme &&
                              this.state.labelsTheme[index]
                            }
                            listNumber={item}

                            listUrl={`/${
                              i18n.languages[0]
                            }/datasets?f=http%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%7C%7C${
                              this.state.valuesTheme &&
                              encodeURIComponent(this.state.valuesTheme[index])
                            }%7C%7Cfalse%7C%7Curi%7C%7CKategorier%7C%7C${
                              this.state.labelsTheme &&
                              this.state.labelsTheme[index]
                            }`}
                            
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
