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
      <div>
        <span className="text-2xl font-bold">{this.props.dataNumber || 0}</span>
        <span className="text-md">{this.props.dataText || ""}</span>
      </div>
    );
  }
}
