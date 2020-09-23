import React, { Component } from 'react';
import i18n from 'i18n';
import { StatisticListItem } from '../StatisticListItem';
import { StatisticDataPresentation } from '../StatisticDataPresentation';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { isIE } from 'react-device-detect';
import '../../../node_modules/react-vis/dist/style.css';

interface StatisticNumbersProps {
  env: EnvSettings;
}

interface StatisticNumbersState {
  publishers?: number;
  datasets?: number;
  concepts?: number;
  terminologies?: number;
  specifications?: number;
}

export class StatisticNumbers extends React.Component<
  StatisticNumbersProps,
  StatisticNumbersState
> {
  constructor(props: StatisticNumbersProps) {
    super(props);
    this.state = {
      publishers: 151,
      datasets: 2180,
      concepts: 111,
      terminologies: 222,
      specifications: 333,
    };
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
    }
  }

  render() {
    if (isIE) {
      return <></>;
    } else {
      return (
        <div className="numbers">
          <div className="statistic-numbers">
            <StatisticDataPresentation
              dataText={i18n.t('pages|search|datasets')}
              dataNumber={this.state.datasets}
            />
            <StatisticDataPresentation
              dataText={i18n.t('pages|search|organization')}
              dataNumber={this.state.publishers}
            />
          </div>
        </div>
      );
    }
  }
}
