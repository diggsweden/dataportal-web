import { FC } from "react";
import QuoteIcon from "@/assets/icons/quote.svg";
import { DOMNode } from "html-react-parser";

const QuoteBlock: FC<{ children: DOMNode[] }> = ({ children }) => {
  return (
    <blockquote className="grid auto-cols-auto gap-lg text-xl font-normal text-pink-600">
      <QuoteIcon className="flex w-[40px]" />
      <div className="col-start-2 flex w-full flex-col space-y-md divide-y">
        {children && children.length > 0 ? (
          children.map((child: any, idx: number) => (
            <span
              key={idx}
              className="last:pt-md last:text-md last:text-brown-600"
            >
              {child}
            </span>
          ))
        ) : (
          <>{children}</>
        )}
      </div>
    </blockquote>
  );
};

export default QuoteBlock;
