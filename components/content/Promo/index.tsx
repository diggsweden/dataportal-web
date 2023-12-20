import { FC } from "react";
import { ButtonLink } from "@/components/global/Button";
import Heading from "@/components/global/Typography/Heading";
import ArrowRightIcon from "@/assets/icons/arrowRight.svg";
import useTranslation from "next-translate/useTranslation";

export interface PromoProps {
  title: string;
  slug: string;
  description?: string;
  linktype?: string;
  __typename?: string;
}

const Promo: FC<{
  link: PromoProps;
  icon?: any;
  inline?: boolean;
}> = ({ link, icon, inline }) => {
  const { t } = useTranslation("common");

  const Icon = icon;

  return (
    <li className="flex flex-col bg-white">
      {icon && (
        <div className="flex justify-center bg-pink-600">
          <Icon />
        </div>
      )}
      <div className="flex h-full flex-col bg-white p-lg">
        <Heading size="h5" className={inline ? "pb-lg" : ""}>
          {link.title}
        </Heading>
        {!inline && (
          <p className="pb-lg pt-sm text-brown-600">{link.description}</p>
        )}
        <ButtonLink
          href={link.slug}
          label={t("read-more")}
          size="sm"
          className="mt-auto"
          icon={ArrowRightIcon}
          iconPosition="right"
          target={link.linktype === "EXTERNAL" ? "_blank" : "_self"}
        />
      </div>
    </li>
  );
};

export default Promo;
