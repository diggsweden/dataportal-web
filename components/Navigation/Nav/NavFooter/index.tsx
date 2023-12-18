import { FC } from "react";
import useTranslation from "next-translate/useTranslation";
import Heading from "@/components/global/Typography/Heading";
import { footerNav } from "@/components/navigation/Nav/navData";
import Element from "@/components/global/Typography/Element";

interface NavFooterItem {
  title: string;
  icon: any;
  type?: "internal" | "external" | "email";
  href?: string;
}

interface NavFooterData {
  title: string;
  children: NavFooterItem[];
}

interface NavFooterProps {
  setOpenNavSide: Function;
}

export const NavFooter: FC<NavFooterProps> = ({ setOpenNavSide }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-xl lg:grid lg:grid-cols-2">
      {footerNav.map((footer: NavFooterData, idx: number) => (
        <div key={idx} className="flex flex-col gap-sm">
          <Heading size={"h5"}>{t(`common|${footer.title}`)}</Heading>
          <ul className="space-y-sm">
            {footer.children.map((link, idx: number) => (
              <li
                key={idx}
                /*                 className="text-md text-green-600 underline" */
                onClick={() =>
                  link.type === "internal" && setOpenNavSide(false)
                }
              >
                {link.href ? (
                  <Element
                    variant="a"
                    href={link.href}
                    className="inline-flex items-center gap-sm"
                  >
                    {link.type === "external"
                      ? t(`common|${link.title}`)
                      : link.title}
                    <link.icon
                      className="inline-flex items-center [&_path]:fill-green-600"
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                    />
                  </Element>
                ) : (
                  <Element
                    variant="a"
                    href={`/${t(`routes|${link.title}$path`)}`}
                  >
                    {t(`routes|${link.title}$title`)}
                  </Element>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
