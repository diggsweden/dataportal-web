import { FC } from "react";
import useTranslation from "next-translate/useTranslation";
import Heading from "@/components/global/Typography/Heading";
import { footerNav } from "@/utilities/menuData";
import Link from "next/link";

interface FooterNavItem {
  title: string;
  icon: any;
  type?: "internal" | "external" | "email";
  href?: string;
}

interface FooterNavData {
  title: string;
  children: FooterNavItem[];
}

interface FooterNavProps {
  setOpenSideBar: Function;
}

const FooterNav: FC<FooterNavProps> = ({ setOpenSideBar }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-xl lg:grid lg:grid-cols-2">
      {footerNav.map((footer: FooterNavData, idx: number) => (
        <div key={idx} className="flex flex-col gap-sm">
          <Heading size={"sm"} level={3}>
            {t(`common|${footer.title}`)}
          </Heading>
          <ul className="space-y-sm">
            {footer.children.map((link, idx: number) => (
              <li
                key={idx}
                className="text-md text-green-600 underline underline-offset-[3px]"
                onClick={() =>
                  link.type === "internal" && setOpenSideBar(false)
                }
              >
                {link.href ? (
                  <Link
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
                  </Link>
                ) : (
                  <Link
                    className="inline-flex"
                    href={`/${t(`routes|${link.title}$path`)}`}
                  >
                    {t(`routes|${link.title}$title`)}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FooterNav;
