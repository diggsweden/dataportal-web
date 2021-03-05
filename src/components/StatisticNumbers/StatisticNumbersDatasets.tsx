import React, { Component } from 'react';
import i18n from 'i18n';
import { StatisticListItem } from '../StatisticListItem';
import { StatisticDataPresentation } from '../StatisticDataPresentation';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { isIE } from 'react-device-detect';
import '../../../node_modules/react-vis/dist/style.css';

interface StatisticNumbersDatasetsProps {
  env: EnvSettings;
}

interface StatisticNumbersDatasetsState {
  datasets?: number;
}

export class StatisticNumbersDatasets extends React.Component<
  StatisticNumbersDatasetsProps,
  StatisticNumbersDatasetsState
> {
  constructor(props: StatisticNumbersDatasetsProps) {
    super(props);
    this.state = {
      datasets: 2180,
    };
  }

  componentWillMount() {
    if (typeof fetch !== 'undefined') {
      fetch(
        this.props.env.ENTRYSCAPE_ORG_STATS_URL
          ? this.props.env.ENTRYSCAPE_ORG_STATS_URL
          : 'https://admin.dataportal.se/charts/orgData.json'
      )
        .then((response) => response.json())
        .then((data) => {
          if (data && data.datasetCount)
            this.setState({
              datasets: data.datasetCount,
            });
        });
    }
  }

  render() {
    if (isIE) {
      return <></>;
    } else {
      return <span className="text-4"> {this.state.datasets}</span>;
    }
  }
}
