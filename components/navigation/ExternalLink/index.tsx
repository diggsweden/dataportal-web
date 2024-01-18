import useTranslation from "next-translate/useTranslation";
import Link, { LinkProps } from "next/link";
import { onlyText } from "react-children-utilities";

interface ExternalLinkProps extends LinkProps {
  className?: string;
  children?: React.ReactNode;
  isMail?: boolean;
}

export const ExternalLink: React.FC<ExternalLinkProps> = (props) => {
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
