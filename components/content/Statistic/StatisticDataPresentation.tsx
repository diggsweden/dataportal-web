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
      <div className="bg-white px-xl py-[50px] text-center">
        <span className="block text-5xl text-primary">
          {this.props.dataNumber || 0}
        </span>
        <span className="block text-md">{this.props.dataText || ""}</span>
      </div>
    );
  }
}
