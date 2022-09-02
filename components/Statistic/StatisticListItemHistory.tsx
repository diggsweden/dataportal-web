import React from 'react';

interface StatisticListItemHistoryProps {
  listText?: any;
  listNumber?: number;
}

export class StatisticListItemHistory extends React.Component<StatisticListItemHistoryProps> {
  constructor(props: StatisticListItemHistoryProps) {
    super(props);
  }
  render() {
    return (
      <li>
        <span className="text-md">{this.props.listText}</span>
        <span className="list-value text-md font-bold">{this.props.listNumber}</span>
      </li>
    );
  }
}
