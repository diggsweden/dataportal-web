import React, { Component } from "react";

interface StatisticListItemHistoryProps {
  listText?: any;
  listNumber?: number;
}

export class StatisticListItemHistory extends Component<StatisticListItemHistoryProps> {
  constructor(props: StatisticListItemHistoryProps) {
    super(props);
  }

  render() {
    return (
      <li className="pl-sm">
        <p className="inline-flex w-full justify-between">
          <span className="">{this.props.listText}</span>
          <span className="text-right font-strong">
            {this.props.listNumber}
          </span>
        </p>
      </li>
    );
  }
}
