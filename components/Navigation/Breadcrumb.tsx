import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { capitalizeFirstLetter } from "../../utilities";
import { checkLang } from "../../utilities";

export interface BreadcrumbProps {
  name: string;
  crumbs: Breadcrumb[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ crumbs, name }) => {
  const { lang } = useTranslation();

  return (
    <div className="breadcrumb text-sm">
      {crumbs.length > 0 && (
        <ol className="breadcrumb__list">
          {crumbs.map((crumb, index) => {
            return (
              <li key={index} className="breadcrumb__list--item text-xs">
                <Link href={`${crumb.link.link}`} locale={lang}>
                  {checkLang(capitalizeFirstLetter(crumb.name))}
                </Link>
                {index !== crumbs.length && (
                  <span aria-hidden={true} className="breadcrumb-slash">
                    /
                  </span>
                )}
              </li>
            );
          })}
          <li
            key={"inactive-breadcrumb"}
            className="breadcrumb__list--item text-xs"
          >
            {checkLang(name)}
          </li>
        </ol>
      )}
    </div>
  );
};
