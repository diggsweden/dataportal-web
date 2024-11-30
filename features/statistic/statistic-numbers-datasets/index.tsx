import { useContext, useEffect, useState } from "react";

import { SettingsContext } from "@/providers/settings-provider";

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
  }, []);

  return <span className="text-lg font-strong"> {state.datasets}</span>;
};
