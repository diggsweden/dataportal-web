import { MeiliSearch } from "meilisearch";
import Head from "next/head";
import React, { useEffect, useState } from "react";

export const SearchTestPage: React.FC = () => {
  const [hits, setHits] = useState<any[]>();
  const [searchWord, setSearchWord] = useState("");

  const client = new MeiliSearch({
    host: "http://127.0.0.1:7700",
    apiKey: "MASTER_KEY",
  });

  const index = client.index("dataportal_content");

  useEffect(() => {
    const search = async () => {
      index
        .search(searchWord, { attributesToHighlight: ["*"] })
        .then((result: any) => {
          setHits(result.hits);
        });
    };

    search();
  }, [searchWord]);

  return (
    <>
      <Head>
        <title>{`Söktest - Sveriges dataportal`}</title>
        <meta property="og:title" content={`Söktest - Sveriges dataportal`} />
        <meta name="twitter:title" content={`Söktest - Sveriges dataportal`} />
      </Head>
      <div className="container">
        <h2>Söktest </h2>
        <div className="content statistic-page">
          <h2>Sök direkt via Meiliclient</h2>
          <input
            autoFocus
            id="search-field"
            autoComplete="off"
            name="q"
            value={searchWord}
            onChange={(event) => setSearchWord(event.target.value)}
            type="text"
          ></input>
          <ul>
            {hits &&
              hits.map((r: any, index: number) => (
                <li key={index}>{r.name}</li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
};
