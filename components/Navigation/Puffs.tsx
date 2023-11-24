import {
  ArrowIcon,
  colorPalette,
  css,
  GetIcon,
  space,
  theme,
} from "@digg/design-system";
import Link from "next/link";
import { useRouter } from "next/router";
import { checkLang } from "../../utilities/checkLang";
import Image from "next/image";
import offentligAiIcon from "../../public/icons/offentligAI.svg";
export interface IPuff {
  title?: string;
  slug: string;
  description?: string;
  icon?: DiggIcon;
  colors?: ColorGroupOverride;
}

const styles = (puff: IPuff) => css`
  background: ${colorPalette[puff.colors?.background || "gray900"]};
  .puff-heading {
    @media screen and (min-width: ${theme.breakpoints[1]}) {
      ${space({ mb: puff.description ? 2 : 0 })};
    }
    a {
      color: ${colorPalette[puff.colors?.accent || "pinkPop"]};
    }
  }
`;

// Todo - remove any
export const Puffs: React.FC<{
  basepath?: string | undefined;
  links: IPuff[];
}> = ({ basepath, links }) => {
  const router = useRouter();
  return (
    <ul
      className={`text-md font-bold  ${
        links.length >= 5 ? "initiativPuffs" : "puffblock"
      }`}
    >
      {links.map((puff, index) => {
        if (puff.slug === "") {
          return null;
        }

        const Icon = puff.icon && GetIcon(puff.icon);
        const checkIcon = puff.icon && puff.icon === "bookThin"; // change bookThin to "offentligAI"
        const isDataSet = [
          "datasets?q=&f=",
          "concepts?q=&f=",
          "specifications?q=&f=",
        ].some((page) => {
          return puff.slug.includes(page);
        });
        const linkPath = `${basepath && !isDataSet ? basepath : ""}${
          puff?.slug
        }`;

        return (
          <li
            key={index}
            onClick={(e) => {
              e.metaKey || e.ctrlKey
                ? window.open(linkPath, "_blank")
                : router.push(linkPath);
            }}
            css={styles(puff)}
          >
            {Icon && (
              <span className="theme-svg">
                {checkIcon ? (
                  <div className="image-svg">
                    <Image src={offentligAiIcon} alt={"offentligAiIcon"} />
                  </div>
                ) : (
                  <Icon width={64} color={colorPalette["white"]}></Icon>
                )}
              </span>
            )}
            <span className="puff-heading">
              <Link href={linkPath} className="text-md">
                {checkLang(puff?.title || puff?.slug)}
              </Link>
              <ArrowIcon
                width={24}
                color={colorPalette[puff.colors?.accent || "pinkPop"]}
              />
            </span>
            {puff?.description && (
              <p className="puff-body text-base font-normal">
                {checkLang(puff?.description)}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default Puffs;
