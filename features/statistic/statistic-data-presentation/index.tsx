import React from "react";

interface StatisticDataPresentationProps {
  dataText?: string;
  dataNumber?: number;
}

export class StatisticDataPresentation extends React.Component<StatisticDataPresentationProps> {
  constructor(props: StatisticDataPresentationProps) {
    super(props);
  }

  render() {
    return (
      <div className="w-full bg-white px-lg py-[3.125rem] text-center first:mb-lg">
        <span className="block break-words text-2xl text-primary">
          {this.props.dataNumber || 0}
        </span>
        <span className="block hyphens-auto text-md">
          {this.props.dataText || ""}
        </span>
      </div>
    );
  }
}
