import { Heading } from "@/components/global/Typography/Heading";
import { Container } from "@/components/layout/Container";
import { SettingsContext } from "@/providers/SettingsProvider";
import { usePathname } from "next/navigation";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { linkBase } from "@/utilities";
// import useTranslation from "next-translate/useTranslation";
// import { EntrystoreContext } from "@/providers/EntrystoreProvider";

export const MQACategoryPage: FC<{ curi?: string; scheme?: string }> = ({
  curi,
  scheme,
}) => {
  // const { lang } = useTranslation();
  // const entry = useContext(EntrystoreContext);
  const { env, setBreadcrumb } = useContext(SettingsContext);
  const pathname = usePathname();
  const ref = useRef(null);
  const [title, setTitle] = useState("");
  let postscribe: any;

  // console.log("entry", entry);
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
    addScripts();

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
    /*     const categoryTitle = document.querySelector("#mqaCategoryTitle");

    if (categoryTitle?.textContent) {
      setTitle(categoryTitle.textContent);
    }

    if (ref.current) {
      setTitle(ref.current.innerHTML);
    } */
    setTitle("Katalog");
  }, [ref.current]);

  useEffect(() => {
    setBreadcrumb &&
      setBreadcrumb({
        name: title,
        crumbs: [
          { name: "start", link: { ...linkBase, link: "/" } },
          {
            name: "MQA",
            link: {
              ...linkBase,
              link: `/mqa`,
            },
          },
        ],
      });
  }, [pathname]);

  const addScripts = () => {
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
          
          function getDataportalUri(resourceUri, isTerm){

            var path = '';                      

            if(resourceUri.indexOf('://') > -1)
            {
              var tmp = resourceUri.split("://");
              path = tmp[0] + '/' + tmp[1];
            }
            else
              path = resourceUri;              

            if(resourceUri && window && window.location.pathname && window.location.pathname.indexOf("/mqa/") > -1)
                return "/mqa/" + path;


            return resourceUri;
          }

          
          window.__entryscape_config = [{
            block: 'config',
            page_language: 'sv',
            routes: [              
              {
                regex:new RegExp('(\/*\/mqa\/)(.+)'),
                uri:'${scheme}://${curi}',
                page_language: 'sv'
              },                                      
            ],           
            entrystore: 'https://${
              env.ENTRYSCAPE_MQA_PATH
                ? env.ENTRYSCAPE_MQA_PATH
                : "editera.dataportal.se"
            }/store',
            clicks: {
              category: 'index',
              test: 'test.html',
            },
            blocks: [

    
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
  };

  return (
    <Container>
      <Heading level={1} size={"lg"} className="mb-lg md:mb-xl"></Heading>

      <div
        data-entryscape="config"
        data-entryscape-entrystore={`https://${env.ENTRYSCAPE_MQA_PATH}/store`}
      ></div>
      <span
        ref={ref}
        id="mqaCategoryTitle"
        className="hidden"
        data-entryscape="template"
        data-entryscape-template={'{{prop "dcterms:title"}}'}
      ></span>

      <div data-entryscape="catalogMQA" className="catalogMQA"></div>
    </Container>
  );
};
