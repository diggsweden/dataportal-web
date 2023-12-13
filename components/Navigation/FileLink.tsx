interface FileLinkProps {
  link: string;
  children?: React.ReactNode;
}

export const FileLink: React.FC<FileLinkProps> = ({ children, link }) => {
  return (
    <div>
      {/*<Link href={`${link}`}>{children}</Link>*/}
      {children}
      {/*<PdfIcon width={24} color="white" />*/}
    </div>
  );
};
