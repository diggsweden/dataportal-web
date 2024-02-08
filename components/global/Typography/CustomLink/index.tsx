import useTranslation from "next-translate/useTranslation";
import Link, { LinkProps } from "next/link";
import { FC } from "react";
import { onlyText } from "react-children-utilities";

interface CustomLinkProps extends LinkProps {
  className?: string;
  children?: React.ReactNode;
  isMail?: boolean;
}

export const CustomLink: FC<CustomLinkProps> = (props) => {
  const { t } = useTranslation("common");
  const text = onlyText(props.children);
  return (
    <Link
      {...props}
      className={props.className}
      aria-label={`${text} - ${t(
        props.isMail ? "email_link" : "external_link",
      )}`}
    >
      <span>{props.children}</span>
    </Link>
  );
};
