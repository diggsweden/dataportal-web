import { usePathname } from "next/navigation";
import { FC, useContext, useEffect } from "react";

import ArrowIcon from "@/assets/icons/arrow-right.svg";
import { BlockList } from "@/components/blocks/block-list";
import { ButtonLink } from "@/components/button";
import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { ModuleDataFragment } from "@/graphql/__generated__/operations";
import { SettingsContext } from "@/providers/settings-provider";
import { linkBase } from "@/utilities";

export const FortroendeIntroPage: FC<ModuleDataFragment> = ({ blocks }) => {
  const { setBreadcrumb } = useContext(SettingsContext);
  const pathname = usePathname();
  const intro = blocks.slice(0, 1);
  const extraInfo = blocks.slice(1);

  useEffect(() => {
    setBreadcrumb?.({
      name: "Förtroendemodellen",
      crumbs: [{ name: "start", link: { ...linkBase, link: "/" } }],
    });
  }, [pathname]);

  return (
    <Container>
      <div>
        <Heading size={"lg"} level={1}>
          Förtroendemodellen
        </Heading>
        {intro && <BlockList blocks={intro} />}
      </div>

      <div className="my-xl flex max-w-md flex-col gap-md md:flex-row md:justify-between">
        <ButtonLink
          href={pathname + "/infor-utveckling"}
          label="Inför utveckling"
          icon={ArrowIcon}
          iconPosition="right"
        />
        <ButtonLink
          href={pathname + "/utveckling"}
          label="Utveckling och drift"
          icon={ArrowIcon}
          iconPosition="right"
        />
        <ButtonLink
          href={pathname + "/uppfoljning"}
          label="Uppföljning"
          icon={ArrowIcon}
          iconPosition="right"
        />
      </div>

      <div className="max-w-md">
        {extraInfo && <BlockList blocks={extraInfo} />}
      </div>
    </Container>
  );
};
