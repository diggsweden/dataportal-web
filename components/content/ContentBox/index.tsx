import { FC, PropsWithChildren } from "react";
import { Heading } from "@/components/global/Typography/Heading";

type ContentBoxProps = {
  heading: string;
  description?: string;
};

export const ContentBox: FC<PropsWithChildren<ContentBoxProps>> = ({
  heading,
  description,
  children,
}) => {
  return (
    <div className="my-xl max-w-xl space-y-lg bg-white p-xl md:my-2xl md:space-y-xl md:p-2xl">
      <Heading level={2} size={"lg"} className="text-center text-primary">
        {heading}
      </Heading>
      {description && <p className="text-center">{description}</p>}
      {children}
    </div>
  );
};
