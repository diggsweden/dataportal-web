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
                <span className="text-5">
                  {this.props.listText}
                </span>
                <span className="list-value text-5-bold">
                    {this.props.listNumber}
                </span>
            </li>
        );
    }
}
