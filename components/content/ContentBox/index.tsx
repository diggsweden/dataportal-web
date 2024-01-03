import { FC } from "react";
import { Heading } from "@/components/global/Typography/Heading";
import { ButtonLink } from "@/components/global/Button";
import { isExternalLink } from "@/utilities";
import ArrowRightIcon from "@/assets/icons/arrowRight.svg";
import ExternalLinkIcon from "@/assets/icons/external-link.svg";

type ContentBoxProps = {
  heading: string;
  description?: string;
  links?: { href: string; label: string }[];
};

export const ContentBox: FC<ContentBoxProps> = ({
  heading,
  description,
  links,
}) => {
  return (
    <div className="max-w-xl space-y-xl bg-white p-2xl">
      <Heading level={2} size={"lg"} className="text-center text-primary">
        {heading}
      </Heading>
      <p className="text-center">{description}</p>
      <div className="flex justify-center gap-xl">
        {links?.map((link, idx: number) => (
          <ButtonLink
            key={idx}
            href={link.href}
            label={link.label}
            target={isExternalLink(link.href) ? "_blank" : "_self"}
            icon={isExternalLink(link.href) ? ExternalLinkIcon : ArrowRightIcon}
            iconPosition="right"
          />
        ))}
      </div>
    </div>
  );
};
