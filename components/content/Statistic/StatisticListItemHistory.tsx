import React from "react";

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
        <span className="list-value font-bold text-md">
          {this.props.listNumber}
        </span>
      </li>
    );
  }
}
