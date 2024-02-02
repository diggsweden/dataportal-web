import { Heading } from "@/components/global/Typography/Heading";
import { Container } from "@/components/layout/Container";
import { SettingsContext } from "@/providers/SettingsProvider";
import { usePathname } from "next/navigation";
import { FC, useContext, useEffect } from "react";
import { linkBase } from "@/utilities";
import { EntrystoreContext } from "@/providers/EntrystoreProvider";

export const MQACategoryPage: FC = () => {
  const entry = useContext(EntrystoreContext);
  const { env, setBreadcrumb } = useContext(SettingsContext);
  const pathname = usePathname();
  // let postscribe: any;

  /**
   * Async load scripts requiered for EntryScape blocks,
   * or else blocks wont have access to DOM
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
    /*     addScripts(); */

    const script1 = document.createElement("script");
    script1.src = env.ENTRYSCAPE_MQA_URL;
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = env.ENTRYSCAPE_BLOCKS_URL;
    script2.async = true;
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  useEffect(() => {
    setBreadcrumb &&
      setBreadcrumb({
        name: entry.title,
        crumbs: [
          { name: "start", link: { ...linkBase, link: "/" } },
          {
            name: "Metadatakvalitet per katalog",
            link: {
              ...linkBase,
              link: `/mqa`,
            },
          },
        ],
      });
  }, [pathname, entry.title]);

  /* This is kept for when the pathname url should be improved */
  /*   const addScripts = () => {
    if (typeof window !== "undefined") {
      postscribe = (window as any).postscribe;

      if (curi) {
        postscribe(
          "#scriptsPlaceholder",
          `                     
          <script>          

          var __entryscape_plugin_config = {
            entrystore_base: 'https:\/\/${
              env.ENTRYSCAPE_TERMS_PATH
                ? env.ENTRYSCAPE_TERMS_PATH
                : "editera.dataportal.se"
            }\/store'          
          };
          </script>

          <script> 
          
          window.__entryscape_config = [{
            block: 'config',
            page_language: 'sv',
            routes: [              
              {
                regex:new RegExp('(\/*\/mqa\/)(.+)'),
                uri:'/${curi}',
                page_language: 'sv'
              },                                      
            ],           
            entrystore: 'https://${
              env.ENTRYSCAPE_MQA_PATH
                ? env.ENTRYSCAPE_MQA_PATH
                : "editera.dataportal.se"
            }/store',  
            blocks: [
              {
                block: 'catalogMQA',
                extends: 'template',
                testData: false,
                template: '{{charts mqaOverview=false}}',
              },
              {
                block: 'charts',
                extends: 'template',
                mqaOverview: false,
                before(node, data) {
                  return data.entry
                      .getResource(true)
                      .getJSON()
                      .then((jsonData) => {
                        const dimensionData = { data: { labels: [], datasets: [] }, colors: [{ backgroundColor: [] }] };
                        data.indicatorData = esbMqaTemplate.map(({ dimensionKey, dimensionLabel, indicators, color }) => {
                          dimensionData.data.labels.push(dimensionLabel);
                          dimensionData.data.datasets.push(jsonData[dimensionKey]?.score.percentage || 0);
             
                          return {
                            label: dimensionLabel,
                            id: dimensionKey,
                            color,
                            indicators: indicators.map(({ indicatorKey, indicatorLabel, okRegex = /yes/ }) => {
                              const chartData = { labels: [], datasets: [] };
                              const colors = [];
                              jsonData[dimensionKey]?.indicators[indicatorKey]?.score.forEach(({ name, percentage }) => {
                 
                                const labelReplacer = esbMqaIndicatorResults.find((label) => label.pattern.test(name));
                                chartData.labels.push(name.replace(labelReplacer.pattern, labelReplacer.replacement));
                                chartData.datasets.push(percentage || 0);
                              });
                              return {
                                colors: JSON.stringify(colors),
                                label: indicatorLabel,
                                data: JSON.stringify(chartData),
                              };
                            }),
                          };
                        });
                        data.dimensionData = {
                          data: JSON.stringify(dimensionData.data),
                          colors: JSON.stringify(dimensionData.colors),
                        };
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                },
                template:
                    '<div class="esbChartsContainer--grid">' +
                    '{{#unless mqaOverview}}' +
                    ' <h2>{{state.catalogHeading}} {{prop "dcterms:title"}}</h2>' +
                    '{{/unless}}' +
                    '{{#ifprop "esterms:success" literal="true"}}' +
                    ' <div class="esbTopContainer--flex">' +
                    '   <div class="esbRadarChartContainer">' +
                    '   {{#if mqaOverview}}' +
                    '     <h2>{{state.overviewRadarHeading}}</h2><span class="esbChartInfo">{{info mqa=true}}</span>' +
                    '     {{dimensionRadarChart data=dimensionData.data colors=dimensionData.colors}}' +
                    '     {{expandingCharts indicatorData="inherit"}}' +
                    '   {{else}}' +
                    '     <h2>{{state.catalogRadarHeading}}</h2><span class="esbChartInfo">{{info mqa=true}}</span>' +
                    '     {{dimensionRadarChart data=dimensionData.data colors=dimensionData.colors}}' +
                    '   {{/if}}' +
                    '   </div>' +
                    '   <div class="esbScoreCardsContainer--flex">' +
                    '     <div class="esbMQAResultCard">{{mqaResult mqaOverview="inherit"}}</div>' +
                    '     <div class="esbFiveStarResultCard">{{fiveStarResult mqaOverview="inherit"}}</div>' +
                    '   </div>' +
                    ' </div>' +
                    ' {{#unless mqaOverview}}' +
                    ' <div class="esbDimensionsContainer--grid">{{indicatorCharts indicatorData="inherit"}}</div>' +
                    ' {{/unless}}' +
                    '{{/ifprop}}' +
                    '</div>',
              },
            ],
            
          }];

          </script>
          
          <script src="${env.ENTRYSCAPE_MQA_URL}"></script>
          <script src="${env.ENTRYSCAPE_BLOCKS_URL}"></script>         
          `,
          {
            done: function () {},
          },
        );
      }
    }
  }; */

  return (
    <Container>
      <Heading level={1} size={"lg"} className="mb-lg md:mb-xl"></Heading>

      <div
        data-entryscape="config"
        data-entryscape-entrystore={`https://${env.ENTRYSCAPE_MQA_PATH}/store`}
      ></div>

      <div data-entryscape="catalogMQA" className="catalogMQA"></div>
    </Container>
  );
};
