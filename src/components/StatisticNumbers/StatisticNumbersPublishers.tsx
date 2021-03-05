import React, { Component } from 'react';
import i18n from 'i18n';
import { StatisticListItem } from '../StatisticListItem';
import { StatisticDataPresentation } from '../StatisticDataPresentation';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { isIE } from 'react-device-detect';
import '../../../node_modules/react-vis/dist/style.css';

interface StatisticNumbersPublishersProps {
  env: EnvSettings;
}

interface StatisticNumbersPublishersState {
  publishers?: number;
}

export class StatisticNumbersDatasets extends React.Component<
StatisticNumbersPublishersProps,
StatisticNumbersPublishersState
> {
  constructor(props: StatisticNumbersPublishersProps) {
    super(props);
    this.state = {
      publishers: 151,
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
          if (data && data.datasetCount && data.publisherCount)
            this.setState({
              publishers: data.publisherCount,
            });
        });
    }
  }

  render() {
    if (isIE) {
      return <></>;
    } else {
      return (
            <span className="text-4">{this.state.publishers}</span>
      );
    }
  }
}
