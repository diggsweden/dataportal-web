import { useContext, useEffect, useState } from "react";

import { SettingsContext } from "@/providers/settings-provider";

export const StatisticNumbersPublishers = () => {
  const { env } = useContext(SettingsContext);
  const [state, setState] = useState({
    publishers: 151,
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
          if (data && data.datasetCount && data.publisherCount)
            setState({
              publishers: data.publisherCount,
            });
        });
    }
  });

  return <span className="text-lg">{state.publishers}</span>;
};
