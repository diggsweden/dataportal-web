import { css, PdfIcon, styled } from "@digg/design-system";

interface FileLinkProps {
  link: string;
  children?: React.ReactNode;
}

const Link = styled.a`
  margin-right: 8px;
`;

export const FileLink: React.FC<FileLinkProps> = ({ children, link }) => {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
      `}
    >
      <Link href={`${link}`}>{children}</Link>
      <PdfIcon width={24} color="white" />
    </div>
  );
};
