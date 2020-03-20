import React from 'react';

interface StatisticListItemProps {
    listText?: any;
    listNumber?: number;
    listUrl?: any;
}

export class StatisticListItem extends React.Component<StatisticListItemProps> {
    constructor(props: StatisticListItemProps) {
        super(props);
      }
    render() {
        return (
            <li>
                <a className="text-5" href={this.props.listUrl || '#'}>
                  {this.props.listText}
                </a>
                <span className="text-5">
                    {this.props.listNumber}
                </span>
            </li>
        );
    }
}
