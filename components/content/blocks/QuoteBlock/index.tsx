import { FC } from "react";
import QuoteIcon from "@/assets/icons/quote.svg";
import { QuoteFragment } from "@/graphql/__generated__/operations";
import { CustomImage } from "@/components/global/CustomImage";

export const QuoteBlock: FC<QuoteFragment> = ({ quote, author, image }) => {
  return (
    <blockquote className="flex max-w-md flex-col-reverse items-center gap-lg md:flex-row lg:gap-xl">
      <div className="flex h-fit w-full gap-lg text-md font-normal text-pink-600 md:text-lg lg:text-xl">
        <QuoteIcon className="flex w-full max-w-[40px]" />
        <div className="mt-sm flex w-full flex-col space-y-md divide-y md:mt-xs">
          <span>{quote}</span>
          <span className="border-brown-200 pt-md text-md text-brown-600 md:text-lg">
            {author}
          </span>
        </div>
      </div>
      {image && (
        <CustomImage
          sizes="(max-width: 640px) 10vw, 100px"
          width={128}
          image={image || {}}
          className="h-[120px] max-w-[120px] rounded-full object-cover"
        />
      )}
    </blockquote>
  );
};
