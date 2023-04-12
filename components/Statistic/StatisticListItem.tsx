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
      <li>
        <Link href={this.props.listUrl || "#"} className="text-md font-normal">
          {this.props.listText}
        </Link>
        <span className="list-value text-md font-bold">
          {this.props.listNumber}
        </span>
      </li>
    );
  }
}
