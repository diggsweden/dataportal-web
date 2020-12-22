import React from 'react';
import { Link } from 'react-router-dom';

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
                <Link className="text-5" to={this.props.listUrl || '#'}>
                  {this.props.listText}
                </Link>
                <span className="list-value text-5-bold">
                    {this.props.listNumber}
                </span>
            </li>
        );
    }
}
