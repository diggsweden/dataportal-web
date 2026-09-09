"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useContext, useEffect, useRef, useState } from "react";
import { EntryscapeResourcePage } from "@/app/[locale]/(entryscape)/_components/entryscape-resource-page";
import { ResourceImage } from "@/app/[locale]/(entryscape)/_components/resource-image";
import { useActiveHeading } from "@/hooks/use-active-heading";
import { EntrystoreContext } from "@/lib/entrystore/provider";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";

const sectionId = (anchor: HTMLAnchorElement) => {
  const hash = anchor.hash.slice(1);
  try {
    return decodeURIComponent(hash);
  } catch {
    return hash;
  }
};

const markActive = (toc: HTMLElement, activeId: string | null) => {
  toc.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.toggleAttribute("data-active", sectionId(anchor) === activeId);
  });
};

export function ApplicationProfilePage() {
  const entry = useContext(EntrystoreContext);
  const t = useTranslations();
  const params = useParams<{ spec: string; param?: string }>();
  const tocRef = useRef<HTMLElement>(null);
  const [sectionIds, setSectionIds] = useState<string[]>([]);
  const [activeId] = useActiveHeading(sectionIds);
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;
  const specificationsPath = t("routes.specifications.path");
  const specHref = params.param
    ? `/${specificationsPath}/${params.spec}/${params.param}`
    : `/${specificationsPath}/${params.spec}`;

  useEffect(() => {
    const toc = tocRef.current;
    if (!toc) return;

    const collect = () => {
      const ids: string[] = [];
      toc
        .querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
        .forEach((anchor) => {
          ids.push(sectionId(anchor));
        });
      setSectionIds((current) =>
        current.join(" ") === ids.join(" ") ? current : ids,
      );
      // The effect below won't rerun when the ids are unchanged.
      markActive(toc, activeIdRef.current);
    };

    const observer = new MutationObserver(collect);
    observer.observe(toc, { childList: true, subtree: true });
    collect();

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const toc = tocRef.current;
    if (!toc) return;

    markActive(toc, activeId);
  }, [activeId, sectionIds]);

  return (
    <EntryscapeResourcePage
      breadcrumb={buildBreadcrumb(
        t("pages.specification_page.application_profile"),
        [
          {
            name: t("routes.specifications.title"),
            link: `/${specificationsPath}?q=&f=`,
          },
          {
            name: entry.title,
            link: specHref,
          },
        ],
      )}
      columnsClassName="lg:flex-row-reverse"
      mainClassName={"overflow-x-hidden"}
      sidebarPosition="left"
      title={<div data-entryscape="apTitle" />}
      intro={
        <div className="max-w-md space-y-md">
          <div data-entryscape="apStatus" />
          <div data-entryscape="apHeaderMetadataMain" />
          <div data-entryscape="apHeaderMetadataDetails" />
          <ResourceImage />
        </div>
      }
      main={
        <>
          {/* Decoy: init() throws without a `.rdforms-specs` element. */}
          <div className="rdforms-specs" hidden />

          <div
            data-entryscape="loadAp"
            data-entryscape-toc-id="toc"
            className="hidden"
          />
          <div id="rdforms-specs-content">
            <section data-entryscape="apDescription" />
          </div>
        </>
      }
      sidebar={
        <nav
          ref={tocRef}
          id="toc"
          className="w-full overflow-y-auto lg:sticky lg:top-[4.75rem] lg:max-h-[calc(100vh-9.5rem)]"
        />
      }
    />
  );
}
