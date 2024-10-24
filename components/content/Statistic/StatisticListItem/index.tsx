import Link from "next/link";
import React from "react";

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
      <li className="mb-lg pl-sm last:mb-none">
        <div className="flex w-full justify-between">
          <Link
            href={this.props.listUrl || "#"}
            className="mr-sm text-green-600"
          >
            {this.props.listText}
          </Link>
          <span className="font-strong">{this.props.listNumber}</span>
        </div>
      </li>
    );
  }
}
