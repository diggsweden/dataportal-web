import React, { useContext, useEffect } from "react";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import { ApiIndexContext } from "@/providers/ApiIndexContext";
import { EntrystoreContext } from "@/providers/EntrystoreProvider";
import Link from "next/link";
import { SettingsContext } from "@/providers/SettingsProvider";
import {
  customIndicators,
  exploreApiLink,
  keyword,
  linkBase,
  theme,
} from "@/utilities";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/global/Typography/Heading";

export const DataServicePage: React.FC<{
  dataSet: string | string[] | undefined;
  name: string | string[] | undefined;
}> = ({ dataSet, name }) => {
  const { lang, t } = useTranslation();
  const { findDetection } = useContext(ApiIndexContext);
  const { env, setBreadcrumb } = useContext(SettingsContext);
  const entry = useContext(EntrystoreContext);
  const ids = (typeof dataSet === "string" && dataSet.split("_")) || [];
  const cid = ids[0];
  const eid = ids[1];
  let postscribe: any;

  /**
   * Async load scripts requiered for EntryScape blocks,
   * or else blocks won't have access to DOM
   */
  useEffect(() => {
    //we need to reload the page when using the back/forward buttons to a blocks rendered page
    if (typeof window !== "undefined") {
      //check if reffereing search params is set to hash
      if (
        window.location &&
        window.location.hash &&
        window.location.hash.includes("ref=?")
      )
        window.onpopstate = () => {
          window.location.reload();
        };
    }

    setBreadcrumb &&
      setBreadcrumb({
        name: entry.title || "",
        crumbs: [
          { name: "start", link: { ...linkBase, link: "/" } },
          {
            name: t("routes|datasets$title"),
            link: { ...linkBase, link: `/${t("routes|datasets$path")}?q=&f=` },
          },
        ],
      });
  }, [entry.title]);

  useEffect(() => {
    addScripts();
  }, []);

  const addScripts = () => {
    if (typeof window !== "undefined") {
      postscribe = (window as any).postscribe;

      if (eid && cid) {
        postscribe(
          "#scriptsPlaceholder",
          ` 
          <script>
          var __entryscape_plugin_config = {
            entrystore_base: 'https:\/\/${
              env.ENTRYSCAPE_DATASETS_PATH
                ? env.ENTRYSCAPE_DATASETS_PATH
                : "admin.dataportal.se"
            }\/store'          
          };

          function getApiExploreUrl(entryid,apientryid)
          {
            return '/${t(
              "routes|dataservices$path",
            )}/${cid}_'+entryid+'/${name}/apiexplore/'+apientryid
          }

          window.__entryscape_config = [{

            block: 'config',
            page_language: '${lang}',
            entry: '${eid}', 
            context: '${cid}',
            namespaces:{
              esterms: 'http://entryscape.com/terms/',
              peu: 'http://publications.europa.eu/resource/authority/'
            },

            blocks: [
              ${customIndicators},
              ${exploreApiLink},
              ${keyword(t)},
              ${theme(t)},            
            ]
          }]
          </script>              

          <script src="${
            lang == "sv"
              ? env.ENTRYSCAPE_OPENDATA_SV_URL
              : env.ENTRYSCAPE_OPENDATA_EN_URL
          }"></script>
          <script src="${
            env.ENTRYSCAPE_BLOCKS_URL
          }"></script>                       
          `,
          {
            done: function () {},
          },
        );
      }
    }
  };

  return (
    <Container>
      <Head>
        <title>{`${entry.title} - Sveriges dataportal`}</title>
        <meta
          property="og:title"
          content={`${entry.title} - Sveriges dataportal`}
        />
        <meta
          name="twitter:title"
          content={`${entry.title} - Sveriges dataportal`}
        />
      </Head>
      <main>
        <Heading level={1} size={"lg"} className="mb-lg md:mb-xl">
          {entry.title}
        </Heading>

        <div className="gap-2xl lg:flex">
          {/* Left column */}
          <div className="flex flex-col gap-lg">
            {/* Publisher */}
            <script
              type="text/x-entryscape-handlebar"
              data-entryscape="true"
              data-entryscape-component="template"
              dangerouslySetInnerHTML={{
                __html: `
                <span class="text-lg text-textSecondary">
                {{text relation="dcterms:publisher"}} 
                </span> 
                      `,
              }}
            />

            {/* Indicators */}
            <div
              data-entryscape="customIndicators"
              className="indicators flex flex-col flex-wrap gap-x-lg gap-y-sm text-textSecondary md:flex-row"
            />

            {/* Description */}
            <script
              type="text/x-entryscape-handlebar"
              data-entryscape="true"
              data-entryscape-component="template"
              dangerouslySetInnerHTML={{
                __html: `
                  <div class="description text-md">{{text content="\${dcterms:description}"}}</div>
                  `,
              }}
            />

            <div className="bg-white p-lg">
              <script
                type="text/x-entryscape-handlebar"
                data-entryscape="true"
                data-entryscape-component="template"
                dangerouslySetInnerHTML={{
                  __html: `                        
                      <div class="dataservice__access">
                        {{viewMetadata 
                            template="dcat:DataService"
                            filterpredicates="dcterms:title,dcterms:publisher,dcterms:type,dcterms:license,dcterms:accessRights,dcat:landingPage,foaf:page"
                          }}
                      </div>
                      `,
                }}
              />

              {findDetection(cid, eid) && (
                <span className="esbRowAlignSecondary">
                  <Link
                    href={`/${t(
                      "routes|dataservices$path",
                    )}/${cid}_${eid}/${name}/apiexplore/${eid}`}
                    locale={lang}
                    className="dataservice-explore-api-link entryscape link text-md"
                  >
                    Utforska API
                  </Link>
                  <br />
                </span>
              )}
            </div>

            <div className="bg-pink-200 p-lg">
              <Heading level={3}>
                {t("pages|datasetpage$contact-publisher")}
              </Heading>
              <p>
                {t("pages|datasetpage$contact-publisher-text")}
                {t("pages|datasetpage$contact-publisher-text2")}{" "}
                <a
                  className="link"
                  href="https://community.dataportal.se/"
                  lang="en"
                >
                  community
                </a>
                .
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="mb-lg box-border h-fit w-full  max-w-md bg-white p-md lg:mb-none lg:max-w-[296px]">
            <Heading
              level={2}
              size={"sm"}
              className="mb-md font-strong text-textSecondary md:mb-lg"
            >
              {t("pages|dataservicepage$api")}
            </Heading>
            {/* About dataservice */}
            <div data-entryscape="aboutDaservice" className="mb-lg" />
            <script
              type="text/x-entryscape-handlebar"
              data-entryscape="true"
              data-entryscape-component="template"
              dangerouslySetInnerHTML={{
                __html: `
                        <div class="lg:w-full">
                          {{viewMetadata 
                              template="dcat:DataService"
                              filterpredicates="dcterms:title,dcterms:publisher,dcat:endpointURL"
                            }}
                        </div>
                      `,
              }}
            />
          </div>
        </div>
      </main>
    </Container>
  );
};
