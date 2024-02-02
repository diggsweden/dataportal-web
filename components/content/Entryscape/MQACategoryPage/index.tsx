import { Container } from "@/components/layout/Container";
import { SettingsContext } from "@/providers/SettingsProvider";
import { usePathname } from "next/navigation";
import { FC, useContext, useEffect } from "react";
import { linkBase } from "@/utilities";
import { EntrystoreContext } from "@/providers/EntrystoreProvider";
import { useMatomo } from "@datapunt/matomo-tracker-react";

export const MQACategoryPage: FC = () => {
  const entry = useContext(EntrystoreContext);
  const { trackPageView } = useMatomo();
  const { env, setBreadcrumb } = useContext(SettingsContext);
  const pathname = usePathname();
  const ids = pathname.split("/");
  const eid = ids[3];
  const cid = ids[4];

  let postscribe: any;

  /**
   * Async load scripts requiered for EntryScape blocks,
   * or else blocks wont have access to DOM
   */
  useEffect(() => {
    addScripts();
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
              link: `/metadatakvalitet`,
            },
          },
        ],
      });

    trackPageView({ documentTitle: entry.title });
  }, [pathname, entry.title]);

  /* This is kept for when the pathname url should be improved */
  const addScripts = () => {
    if (typeof window !== "undefined") {
      postscribe = (window as any).postscribe;

      if (entry) {
        postscribe(
          "#scriptsPlaceholder",
          `                     
          <script>          

          var __entryscape_plugin_config = {
            entrystore_base: 'https:\/\/${
              env.ENTRYSCAPE_MQA_PATH
                ? env.ENTRYSCAPE_MQA_PATH
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
                regex: new RegExp('(\/*\/metadatakvalitet\/katalog\/)(.+)'),
                uri:'https://${
                  env.ENTRYSCAPE_MQA_PATH
                }/store/${cid}/resource/${eid}',
                page_language: 'sv'
              },                                      
            ],           
            entrystore: 'https://${
              env.ENTRYSCAPE_MQA_PATH
                ? env.ENTRYSCAPE_MQA_PATH
                : "editera.dataportal.se"
            }/store',  
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
  };

  return (
    <Container>
      <div data-entryscape="catalogMQA" className="catalogMQA"></div>
    </Container>
  );
};
