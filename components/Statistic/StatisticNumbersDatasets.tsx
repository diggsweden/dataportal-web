import { useContext, useEffect, useState } from "react";
import { SettingsContext } from "..";
// import { isIE } from 'react-device-detect';

export const StatisticNumbersDatasets = () => {
  const { env } = useContext(SettingsContext);
  const [state, setState] = useState({
    datasets: 2180,
  });

  useEffect(() => {
    if (typeof fetch !== "undefined") {
      fetch(
        env.ENTRYSCAPE_ORG_STATS_URL
          ? env.ENTRYSCAPE_ORG_STATS_URL
          : "https://admin.dataportal.se/charts/orgData.json",
      )
        .then((response) => response.json())
        .then((data) => {
          if (data && data.datasetCount)
            setState({
              datasets: data.datasetCount,
            });
        });
    }
  });

  if (/* isIE do wee still need this */ false) {
    return <></>;
  } else {
    return <span className="text-lg"> {state.datasets}</span>;
  }
};
