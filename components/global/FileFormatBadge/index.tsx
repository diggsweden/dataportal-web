import React, { FC } from "react";

interface FileFormatBadgeProps {
  badgeName: string;
}

export const FileFormatBadge: FC<FileFormatBadgeProps> = ({ badgeName }) => {
  let text, className;

  switch (badgeName) {
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      text = "spreadsheet";
      className = "bc-2";
      break;

    case "text/csv":
      text = "csv";
      className = "bc-1";
      break;

    case "HTML":
      text = "html";
      className = "bc-1";
      break;

    case "text/html":
      text = "html";
      className = "bc-1";
      break;

    case "application/vnd.ms-excel":
      text = "excel";
      className = "bc-1";
      break;

    case "application/xhtml+xml":
      text = "html";
      className = "bc-1";
      break;

    case "application/json":
      text = "json";
      className = "bc-6";
      break;

    case "application/zip":
      text = "zip";
      className = "bc-5";
      break;

    case "application/json+zip":
      text = "json / zip";
      className = "bc-5";
      break;

    case "text/xml":
      text = "xml";
      className = "bc-3";
      break;

    case "wms":
      text = "wms";
      className = "bc-3";
      break;

    case "WMS":
      text = "wms";
      className = "bc-3";
      break;

    case "application/x-shapefile":
      text = "shp";
      className = "bc-4";
      break;

    case "application/rdf+xml":
      text = "rdf";
      className = "bc-2";
      break;

    case "application/ld+json" && "application/json-ld":
      text = "rdf";
      className = "bc-2";
      break;

    case "application/json-ld":
      text = "rdf";
      className = "bc-2";
      break;

    case "GeoJSON (.zip containing .json)":
      text = "geojson";
      className = "bc-2";
      break;

    case "application/atom+xml":
      text = "atom";
      className = "bc-2";
      break;

    case "application/octet-stream":
      text = "octet-stream";
      className = "bc-6";
      break;

    case "application/sparql-query":
      text = "sparql-query";
      className = "bc-4";
      break;

    case "application/pdf":
      text = "pdf";
      className = "bc-8";
      break;

    case "application/xml":
      text = "xml";
      className = "bc-8";
      break;

    case "pdf":
      text = "pdf";
      className = "bc-8";
      break;

    case ".PX - ett standardformat för statistikfiler och används av en stor grupp statistikbyråer.":
      text = "PX";
      className = "bc-3";
      break;

    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet ":
      text = "APPLICATION/XML/SPREADSHEET";
      className = "bc-1";
      break;

    default:
      text = badgeName;
      className = "";
      break;
  }

  return (
    <span className={`bg-pink-200 px-sm py-xs text-sm uppercase ${className}`}>
      {text}
    </span>
  );
};
