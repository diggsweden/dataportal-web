// import { usePathname } from "next/navigation";
// import useTranslation from "next-translate/useTranslation";
// import { FC, useRef, useState } from "react";

// import { BlockList } from "@/components/blocks/block-list";
// import { Button, ButtonLink } from "@/components/button";
// import { ModuleDataFragment } from "@/graphql/__generated__/operations";
// import { FormTypes } from "@/types/form";
// import { GeneratePDF } from "@/utilities/form-utils";
// import { Modal } from "../../modal";
// import { FormGeneratePDF } from "@/components/form/form-generate-pdf";
// import { HtmlParser } from "@/components/typography/html-parser";
// import { Heading } from "@/components/typography/heading";

// type Props = {
//   formDataArray: FormTypes[][];
//   blocks: ModuleDataFragment["blocks"] | null;
//   totalScore: number;
// };

// export const FormEndBlock: FC<Props> = ({
//   formDataArray,
//   blocks,
//   totalScore,
// }) => {
//   const pathname = usePathname();
//   const iframeRef = useRef<HTMLIFrameElement>(null);
//   const [showModal, setShowModal] = useState(false);
//   const { t } = useTranslation();

//   const formDataResult = formDataArray.flatMap((page) =>
//     page.filter(
//       (
//         item,
//       ): item is Extract<
//         FormTypes,
//         { __typename: "dataportal_Digg_FormResult" }
//       > => item.__typename === "dataportal_Digg_FormResult",
//     ),
//   );
// console.log(formDataResult);

//   const matchingResult =
//     formDataResult[0] &&
//     formDataResult[0].result.find(
//       (result) =>
//         totalScore >= result.score_from && totalScore <= result.score_to,
//     );
//   const { heading, text, container } = matchingResult;
//   const { slug, title } = container;

//   return (
//     matchingResult && (
//       <div className="flex flex-col gap-xl">
//         {blocks && (
//           <div className="generate-pdf-block">
//             <BlockList blocks={blocks} />
//           </div>
//         )}
//         <h1>{}</h1>
//         <Heading level={1}>{formDataResult[0].title}</Heading>
//         <div className="bg-white p-lg rounded-lg flex flex-col gap-md">
//           <Heading level={3}>{heading}</Heading>
//           <p>{HtmlParser({ text: text.markdown })}</p>
//           <ButtonLink href={slug} label={title} />
//         </div>
//         <FormGeneratePDF formDataArray={formDataArray} blocks={blocks} />
//       </div>
//     )
//   );
// };
