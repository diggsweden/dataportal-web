import { cx } from "class-variance-authority";
import { DetailsHTMLAttributes, FC, PropsWithChildren, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ArrowRight from "@/assets/icons/arrowRight.svg";
import NavPixels from "@/assets/icons/navPixels.svg";

type NavListProps = {
  icon: any;
  label: string;
  className?: string;
  list: any[];
  setOpenNavSide: Function;
};

const NavList: FC<
  PropsWithChildren<NavListProps & DetailsHTMLAttributes<HTMLDetailsElement>>
> = ({ className, list, label, setOpenNavSide, icon }) => {
  const pathname = usePathname();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const Icon = icon;

  const isActive = (path: string) => {
    if (
      pathname === path ||
      (pathname === "/" && path === t(`common|lang-path`))
    ) {
      return true;
    } else return false;
  };

  return (
    <details
      className={cx("text-brown-600", className)}
      onToggle={() => setOpen(!open)}
      open={open}
    >
      <summary className="group inline-flex w-full cursor-pointer flex-row gap-md p-md pr-xl ">
        <Icon className={open && "[&_path]:fill-pink-600"} />
        <span
          className={`underline-offset-4 group-hover:underline ${
            open && "font-strong text-brown-900"
          }`}
        >
          {label}
        </span>
        <ArrowRight
          className={`absolute right-md ${
            open
              ? "rotate-90 transition-all duration-300 ease-in-out [&_path]:fill-pink-600"
              : "rotate-0 transition-all duration-300 ease-in-out"
          }`}
        />
      </summary>
      <ul className="flex flex-col">
        {list.map((menu, idx: number) => (
          <li
            key={idx}
            className={`group relative overflow-y-hidden ${
              isActive(`/${t(`routes|${menu.title}$path`)}`) &&
              "font-strong bg-pink-100 text-brown-900"
            }`}
            onClick={() => setOpenNavSide(false)}
          >
            <Link
              href={`/${t(`routes|${menu.title}$path`)}`}
              className="inline-flex w-full py-md pl-[48px] pr-xl underline-offset-4 group-hover:underline"
            >
              <>
                {isActive(`/${t(`routes|${menu.title}$path`)}`) && (
                  <NavPixels className="absolute right-none top-none" />
                )}
                <span className="z-50">{t(`routes|${menu.title}$title`)}</span>
              </>
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
};

export default NavList;
