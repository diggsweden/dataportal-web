"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";
import { Button } from "@/components/button";
import { LabelLink, type LabelLinkColor } from "@/components/label-link";
import { Heading } from "@/components/typography/heading";
import type { LabelLink as LabelLinkValue } from "@/lib/entrystore/entrystore-core";

type SidebarItem = string | LabelLinkValue;

interface SidebarSectionProps {
  heading: string;
  items: (SidebarItem | null | undefined)[];
  variant?: "link" | "pill";
  /** Colour forwarded to LabelLink for text (no-url) items; links stay green. */
  color?: LabelLinkColor;
  testId?: string;
  /**
   * When set, only the first `collapseAt` items show and a view more/less
   * toggle is rendered once there are more than that. Omit for no collapsing.
   */
  collapseAt?: number;
  children?: ReactNode;
}

/**
 * A sidebar "heading + list" section for the entryscape resource pages. Items
 * are normalized (`string → { title }`) and empty ones dropped, so the whole
 * section self-hides when there is nothing to show. Everything renders at 15px:
 * links reuse LabelLink (url → green link, no url → secondary text), pills use
 * the shared keyword styling. Pass `collapseAt` to get a built-in show-more.
 */
export function SidebarSection({
  heading,
  items,
  children,
  variant = "link",
  color,
  testId,
  collapseAt,
}: SidebarSectionProps) {
  const t = useTranslations();
  const [showAll, setShowAll] = useState(false);

  const normalized = items
    .map((item) => (typeof item === "string" ? { title: item } : item))
    .filter((item): item is LabelLinkValue => !!item?.title);

  if (normalized.length === 0) return null;

  const canCollapse =
    collapseAt !== undefined && normalized.length > collapseAt;
  const visible =
    canCollapse && !showAll ? normalized.slice(0, collapseAt) : normalized;

  return (
    <div data-test-id={testId}>
      <Heading level={3} size="xxs" className="text-textSecondary mb-sm">
        {heading}
      </Heading>
      <div className="flex flex-col gap-xs">
        {visible.map((item) =>
          variant === "pill" ? (
            <span
              key={`${item.url ?? ""}|${item.title}`}
              className="mb-sm w-fit bg-pink-200 px-sm py-xs text-sm font-strong"
            >
              {item.title}
            </span>
          ) : (
            <LabelLink
              key={`${item.url ?? ""}|${item.title}`}
              value={item}
              size="small"
              color={color}
            />
          ),
        )}
      </div>
      {canCollapse && (
        <Button
          size={"xs"}
          className="mt-xs px-sm py-xs !font-strong text-brown-600"
          variant={"plain"}
          label={
            showAll
              ? t("pages.datasetpage.view_less")
              : t("pages.datasetpage.view_more")
          }
          onClick={() => setShowAll(!showAll)}
        />
      )}
      {children}
    </div>
  );
}
