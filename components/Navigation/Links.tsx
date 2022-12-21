import { css } from "@digg/design-system";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  RelatedContent,
  RelatedContent_links,
} from "../../graphql/__generated__/RelatedContent";
import { isExternalLink } from "../../utilities";
import { checkLang } from "../../utilities/checkLang";
import ExternalLink from "./ExternalLink";

// Todo - remove any
export const Links: React.FC<{
  basepath?: string | undefined;
  links: RelatedContent_links[];
}> = ({ basepath, links }) => {
  const router = useRouter();
  return (
    <ul className="text-md font-bold linkblock">
      {links.map((l, index) => {
        return (
          <li
            css={css`
              span {
              }
            `}
            key={index}
            onClick={() => router.push(`${basepath || ""}${l?.slug}`)}
          >
            <span>
              {l.linktype === "EXTERNAL" ? (
                <ExternalLink
                  href={l?.slug}
                  passHref
                  className="text-md font-normal"
                >
                  {checkLang(l?.title || l?.slug)}
                </ExternalLink>
              ) : (
                <Link
                  href={`${basepath || ""}${l?.slug}`}
                  passHref
                  className="text-md font-normal"
                >
                  {checkLang(l?.title || l?.slug)}
                </Link>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default Links;
