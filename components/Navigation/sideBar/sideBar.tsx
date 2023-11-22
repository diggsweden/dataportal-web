import React, { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import { sideBarConstants } from "./sideBarContent.js";
import Image from "next/image";
import arrowRight from "./menu-icons/arrowRight.svg";
import arrowDown from "./menu-icons/arrowDown.svg";
import externalLink from "./menu-icons/external-link.svg";
import useTranslation from "next-translate/useTranslation";
// import { MenuItem, MenuItemChild } from "../../../types/global.js";

function SideBar({ openSideBar }: any) {
  const [openMenus, setOpenMenus] = useState<number[]>([]);
  const [openMenuItem, setOpenMenuitem] = useState<number>(0);
  const router = useRouter();
  const path: any =
    typeof window !== "undefined" && window.location.pathname.split("/");
  const menuPath: string = "/" + path[path.length - 1];
  const { t } = useTranslation();

  useEffect(() => {
    setOpenMenuitem(0);
  }, [menuPath, openSideBar]);

  const clickedMenu = (id: number) => {
    return openMenus.find((openId: number) => openId == id);
  };

  const subMenuOrSrc = (menu: any) => {
    menu.href === "lang-path"
      ? router.push("/")
      : menu.href
      ? menu.external
        ? window.location.assign(menu.href)
        : router.push(menu.href)
      : null;
    menu.href && !menu.children && setOpenMenuitem(menu.id);
    if (openMenus.includes(menu.id)) {
      setOpenMenus(openMenus.filter((openId: number) => openId !== menu.id));
    } else {
      setOpenMenus([...openMenus, menu.id]);
    }
  };

  const external = (menu: any) => {
    if (menu.children) {
      return (
        <Image
          className={clickedMenu(menu.id) ? "svg-active" : "svg"}
          priority
          src={clickedMenu(menu.id) ? arrowDown : arrowRight}
          height={14}
          width={14}
          alt="svg-icon"
        />
      );
    } else if (menu.external) {
      return (
        <div>
          <Image
            className="svg"
            priority
            src={externalLink}
            height={14}
            width={14}
            alt="svg-icon"
          />
        </div>
      );
    } else return <p className="svg"></p>;
  };

  const menuStyle = (menu: any) => {
    if (menu.children && clickedMenu(menu.id)) {
      return "parentClicked";
    }
    if (menuPath === menu.href || menuPath === t(`common|${menu.href}`)) {
      return "clickedMenu";
    } else return "menuitem";
  };

  return (
    <div className={openSideBar ? "menu" : "menu-out"}>
      <ul className="menuList">
        {sideBarConstants.map((menu: any, idx: number) => (
          <li key={idx}>
            <section
              onClick={() => subMenuOrSrc(menu)}
              className={menuStyle(menu)}
            >
              <div className="logoTitle">
                <Image
                  className={
                    (menu.children && clickedMenu(menu.id)) ||
                    menuPath === menu.href ||
                    menuPath === t(`common|${menu.href}`)
                      ? "svg-active"
                      : "svg"
                  }
                  priority
                  src={menu.icon}
                  height={20}
                  width={20}
                  alt="svg-icon"
                />
                <span>{t(`common|${menu.title}`)}</span>
              </div>
              {external(menu)}
            </section>
            {openMenus.includes(menu.id) && menu.children && (
              <ul className="subMenu">
                {menu.children.map((item: any, idx: number) => (
                  <li
                    onClick={() => {
                      subMenuOrSrc(item);
                    }}
                    key={idx}
                    className={
                      menuPath === item.href
                        ? "clickedSubMenu"
                        : openMenuItem === item.id
                        ? "clickedSubMenu"
                        : "subMenuItem"
                    }
                  >
                    <span>{t(`common|${item.title}`)}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SideBar;
