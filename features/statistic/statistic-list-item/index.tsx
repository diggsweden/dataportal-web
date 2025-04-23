import Link from "next/link";
import { Component } from "react";

interface StatisticListItemProps {
  listText?: string;
  listNumber?: number;
  listUrl?: string;
  translation?: string;
}

export class StatisticListItem extends Component<StatisticListItemProps> {
  constructor(props: StatisticListItemProps) {
    super(props);
  }

  render() {
    return (
      <li className="mb-lg pl-sm last:mb-none">
        <div className="flex w-full justify-between">
          <Link
            href={this.props.listUrl || "#"}
            className="mr-sm hyphens-auto text-green-600"
            aria-label={`${this.props.listText} ${this.props.listNumber} ${this.props.translation}`}
          >
            {this.props.listText}
          </Link>
          <span className="font-strong">{this.props.listNumber}</span>
        </div>
      </li>
    );
  }
}
