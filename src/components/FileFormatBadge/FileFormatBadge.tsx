import React from 'react';

//  Creates format badges with different colors in searchresult..

interface FileFormatBadgeProps {
  badgeName: string;
}

export class FileFormatBadge extends React.Component<
  FileFormatBadgeProps,
  any
> {
  constructor(props: FileFormatBadgeProps) {
    super(props);
  }

  render() {
    let text, className;

    switch (this.props.badgeName) {
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        text = 'spreadsheet';
        className = 'bc-2';
        break;

      case 'text/csv':
        text = 'csv';
        className = 'bc-1';
        break;

      case 'HTML':
        text = 'html';
        className = 'bc-1';
        break;

      case 'text/html':
        text = 'html';
        className = 'bc-1';
        break;

      case 'application/vnd.ms-excel':
        text = 'excel';
        className = 'bc-1';
        break;

      case 'application/xhtml+xml':
        text = 'html';
        className = 'bc-1';
        break;

      case 'application/json':
        text = 'json';
        className = 'bc-6';
        break;

      case 'application/zip':
        text = 'zip';
        className = 'bc-5';
        break;

      case 'application/json+zip':
        text = 'json / zip';
        className = 'bc-5';
        break;

      case 'text/xml':
        text = 'xml';
        className = 'bc-3';
        break;

      case 'wms':
        text = 'wms';
        className = 'bc-3';
        break;

      case 'WMS':
        text = 'wms';
        className = 'bc-3';
        break;

      case 'application/x-shapefile':
        text = 'shp';
        className = 'bc-4';
        break;

      case 'application/rdf+xml':
        text = 'rdf';
        className = 'bc-2';
        break;

      case 'application/ld+json' && 'application/json-ld':
        text = 'rdf';
        className = 'bc-2';
        break;

      case 'application/json-ld':
        text = 'rdf';
        className = 'bc-2';
        break;

      case 'GeoJSON (.zip containing .json)':
        text = 'geojson';
        className = 'bc-2';
        break;

      case 'application/atom+xml':
        text = 'atom';
        className = 'bc-2';
        break;

      case 'application/octet-stream':
        text = 'octet-stream';
        className = 'bc-6';
        break;

      case 'application/sparql-query':
        text = 'sparql-query';
        className = 'bc-4';
        break;

      case 'application/pdf':
        text = 'pdf';
        className = 'bc-8';
        break;

      case 'application/xml':
        text = 'xml';
        className = 'bc-8';
        break;

      case 'pdf':
        text = 'pdf';
        className = 'bc-8';
        break;

      default:
        text = this.props.badgeName;
        className = '';
        break;
    }

    return (
      <span className={`format ${className}`}>
        {text}
      </span>
    );
  }
}
