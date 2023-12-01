import { css } from "@digg/design-system";
import Link from "next/link";
import { useRouter } from "next/router";
import { RelatedContentFragment } from "../../graphql/__generated__/operations";
import { checkLang } from "../../utilities";
import ExternalLink from "./ExternalLink";

// Todo - remove any
export const Links: React.FC<{
  basepath?: string | undefined;
  links: RelatedContentFragment["links"];
}> = ({ basepath, links }) => {
  const router = useRouter();
  return (
    <ul className="linkblock text-md font-bold">
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
