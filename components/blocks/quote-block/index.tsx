import { FC } from "react";

import QuoteIcon from "@/assets/icons/quote.svg";
import { CustomImage } from "@/components/custom-image";
import { QuoteFragment } from "@/graphql/__generated__/operations";

export const QuoteBlock: FC<QuoteFragment> = ({ quote, author, image }) => {
  return (
    <blockquote className="flex max-w-md flex-col items-center gap-lg md:flex-row lg:gap-xl">
      <div className="flex h-fit w-full gap-lg text-xl font-normal text-pink-600">
        <QuoteIcon className="flex w-full max-w-[40px] flex-shrink-0" />
        <div className="mt-sm flex w-full flex-col space-y-md divide-y md:mt-xs">
          <span className="hyphens-auto">{quote}</span>
          <span className="border-brown-200 pt-md text-md text-brown-600">
            {author}
          </span>
        </div>
      </div>
      {image && (
        <CustomImage
          sizes="(max-width: 640px) 10vw, 100px"
          width={128}
          image={image || {}}
          className="h-[7.5rem] max-w-[7.5rem] rounded-full object-cover"
        />
      )}
    </blockquote>
  );
};
