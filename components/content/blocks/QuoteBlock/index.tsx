import { FC } from "react";
import QuoteIcon from "@/assets/icons/quote.svg";
import { QuoteFragment } from "@/graphql/__generated__/operations";
import { CustomImage } from "@/components/global/CustomImage";

export const QuoteBlock: FC<QuoteFragment> = ({ quote, author, image }) => {
  return (
    <blockquote className="flex gap-md lg:gap-lg">
      <div className="grid auto-cols-auto text-md font-normal text-pink-600 md:gap-lg md:text-lg lg:text-xl">
        <QuoteIcon className="flex w-[40px] scale-50 md:scale-75 lg:scale-100" />
        <div className="col-start-2 mt-sm flex w-full flex-col space-y-md divide-y md:mt-xs">
          <span>{quote}</span>
          <span className="border-brown-200 pt-md text-md text-brown-600 md:text-lg">
            {author}
          </span>
        </div>
      </div>
      {image && (
        <CustomImage
          image={image || {}}
          className="h-[50px] max-w-[50px] rounded-full object-cover md:h-[100px] md:max-w-[100px] lg:h-[150px] lg:max-w-[150px]"
        />
      )}
    </blockquote>
  );
};
