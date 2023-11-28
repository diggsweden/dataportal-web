import { styled } from "@digg/design-system";
import useTranslation from "next-translate/useTranslation";
import Link, { LinkProps } from "next/link";
import { onlyText } from "react-children-utilities";

const ExtLink = styled(Link, {
  // shouldForwardProp allows you to send isMail prop to the
  // underlying DOM element that the styled component represents (Link).
  shouldForwardProp: (prop) => prop !== "isMail",
})<{ isMail?: boolean }>`
  //Sets the size of the icon (1.125rem = 18px)
  --size: 1.125rem;

  &::after {
    /* color: white;
    background-image: url('/icons/icon_ExternalLink.svg'); */
    background-color: white;
    -webkit-mask-image: ${({ isMail }) =>
      isMail
        ? "url('/icons/icon_Mail.svg')"
        : "url('/icons/icon_ExternalLink.svg')"};
    mask-image: ${({ isMail }) =>
      isMail
        ? "url('/icons/icon_Mail.svg')"
        : "url('/icons/icon_ExternalLink.svg')"};
    background-size: var(--size) var(--size);
    display: inline-block;
    width: var(--size);
    height: var(--size);
    margin-left: 4px;
    margin-bottom: -4px;
    content: "";
  }
`;

interface ExternalLinkProps extends LinkProps {
  className?: string;
  children?: React.ReactNode;
  isMail?: boolean;
}

export const ExternalLink: React.FC<ExternalLinkProps> = (props) => {
  const { t } = useTranslation("common");
  const text = onlyText(props.children);
  return (
    <ExtLink
      {...props}
      isMail={props.isMail}
      className={props.className}
      aria-label={`${text} - ${t(
        props.isMail ? "email_link" : "external_link",
      )}`}
    >
      <span>{props.children}</span>
    </ExtLink>
  );
};

export default ExternalLink;
