import { FC, useEffect, useRef, useState } from "react";
import { FormDataFragment as IForm } from "@/graphql/__generated__/operations";
import { FormNav } from "@/components/navigation/FormNav";
import useTranslation from "next-translate/useTranslation";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { usePathname } from "next/navigation";
import { ModuleDataFragment } from "@/graphql/__generated__/operations";
import { FormTypes } from "@/types/form";
import { GetLocalstorageData, handleScroll } from "@/utilities/formUtils";
import { Button } from "@/components/global/Button";
import { Heading } from "@/components/global/Typography/Heading";
import { RenderForm } from "@/components/global/Form/RenderForm";
import { FormBottomNav } from "@/components/navigation/FormBottomNav";
import { FormGeneratePDF } from "@/components/global/Form/FormGeneratePDF";
import { ProgressBar } from "@/components/global/ProgressBar";
import Container from "@/components/layout/Container";

type Props = IForm & {
  elements: IForm["elements"];
  module?: ModuleDataFragment["blocks"] | null;
};

export const FormWrapper: FC<Props> = ({ elements, module }) => {
  const { trackPageView } = useMatomo();
  const { t } = useTranslation();
  const pathname = usePathname();
  const [page, setPage] = useState<number>(-1);
  const scrollRef = useRef<HTMLSpanElement>(null);
  const [formDataArray, setFormDataArray] = useState<Array<Array<FormTypes>>>(
    [],
  );

  const [formSteps, setFormSteps] = useState<string[]>([]); //The title of the different pages
  const [showFirstPage, setShowFirstPage] = useState<boolean>(true);
  const [formIntroText, setFormIntroText] = useState<{
    title: string;
    text: string;
  }>({ title: "", text: "" });
  let questionNumber = 1; //Used for visual numberings (can't use ID since we don't want headings/pagebreaks to be numbered)

  useEffect(() => {
    trackPageView({ documentTitle: "Fortroendemodellen" });
  }, [pathname]);

  useEffect(() => {
    if (elements === null || elements.length === 0) {
      return;
    }

    (elements as FormTypes[]).forEach((element, index) => {
      element.ID = index; //Make sure each element has a unique ID
    });

    SetupPages(elements as FormTypes[]);
    GetLocalstorageData(setFormDataArray, elements, pathname);
  }, []);

  const SetupPages = (data: FormTypes[]) => {
    if (data == null) {
      return;
    }
    let currentPage: Array<FormTypes> = [];
    let pageArray: Array<Array<FormTypes>> = [];
    setFormSteps([]);

    //Make sure that nessecary fields exists and have default values
    initializeFields(data);

    //Split the data into pages
    var checkTopHeading = true;
    data.forEach((item, i) => {
      //If first element is a description, we don't want to add it to our data array
      if (i === 0 && item.__typename === "dataportal_Digg_FormDescription") {
        return;
      }

      if (item.__typename === "dataportal_Digg_FormPageBreak") {
        setFormSteps((prev) => [...prev, item.title]);
        if (currentPage.length > 1) {
          pageArray.push(currentPage);
          currentPage = [];
          checkTopHeading = true;
        }
        currentPage.push(item);
      } else {
        if (
          checkTopHeading &&
          item.__typename === "dataportal_Digg_FormDescription"
        ) {
          item.TopHeading = true;
        }
        checkTopHeading = false;
        currentPage.push(item);
      }
    });

    if (currentPage.length > 0) {
      pageArray.push(currentPage);
    }
    setFormDataArray(pageArray);
  };

  const initializeFields = (data: FormTypes[]) => {
    //Make sure that nessecary fields exists and have default values
    data.forEach((item) => {
      setupItem(item);
      if (item.__typename === "dataportal_Digg_FormRadio") {
        item.selected = item.choices[item.choices.length - 1];
        item.choices.forEach((choice, i) => {
          if (choice.popup === null) {
            choice.popup = "";
          }
          choice.ID = parseInt(`${item.ID}${i}`); //create a unique id by using the parent id and the index of the choice
        });
      }
      if (item.__typename === "dataportal_Digg_FormDescription") {
        item.TopHeading = false;
      }
    });

    //If first element is a description we extract it and show it as an intropage to the form.
    if (data[0].__typename === "dataportal_Digg_FormDescription") {
      setShowFirstPage(true);
      setFormIntroText({
        title: data[0].title,
        text: data[0].text.markdown || "",
      });
    } else {
      setShowFirstPage(false);
    }
  };

  //Set default values on fields in an item
  const setupItem = (item: FormTypes) => {
    if (
      item.__typename === "dataportal_Digg_FormText" ||
      item.__typename === "dataportal_Digg_FormTextArea" ||
      item.__typename === "dataportal_Digg_FormRadio"
    ) {
      item.value = "";
      item.number = questionNumber;
      questionNumber++;
    }
  };

  //Set correct starting page depending if any pagebreak exists or not.
  useEffect(() => {
    const pageLastVisit = localStorage.getItem(`${pathname}Page`);
    if (!showFirstPage) {
      setPage(pageLastVisit ? parseInt(pageLastVisit) : 1);
    } else {
      setPage(pageLastVisit ? parseInt(pageLastVisit) : 0);
    }
  }, [showFirstPage]);

  useEffect(() => {
    if (page === -1) return;
    localStorage.setItem(`${pathname}Page`, page.toString());
  }, [page]);

  //Update the fields when data is changed in the form. Handles all types of fields.
  const UpdateFormDataArray = (
    e: React.ChangeEvent<any>,
    fieldToUpdate: FormTypes,
    pageIndex: number,
    imgData: { fileName: string; base64: string } | null = null,
  ) => {
    pageIndex = pageIndex - 1; //Page index starts at 1 since we hardcode the first page.

    if (fieldToUpdate.__typename === "dataportal_Digg_FormChoice") {
      setFormDataArray((prev) => {
        //Find the index of the correct object by finding the choice with the same ID as the data (only for radio buttons)
        let itemIndex = prev[pageIndex].findIndex(
          (item) =>
            "choices" in item &&
            item.choices.some((choice) => choice.ID === fieldToUpdate.ID),
        );
        let foundObj = prev[pageIndex][itemIndex];
        if (foundObj && "choices" in foundObj) {
          foundObj.selected = fieldToUpdate;
        }
        return [...prev];
      });
    } else {
      setFormDataArray((prev) => {
        let itemIndex = prev[pageIndex].findIndex(
          (item) => item.ID === fieldToUpdate.ID,
        );
        let foundObj = prev[pageIndex][itemIndex];
        if ("value" in foundObj) {
          if (imgData) {
            checkForImage(foundObj, imgData);
          }
          foundObj.value = e.target.value;
          prev[pageIndex][itemIndex] = foundObj;
        }
        return [...prev];
      });
    }
    setTimeout(() => {
      localStorage.setItem(`${pathname}Data`, JSON.stringify(formDataArray));
    }, 100);
  };

  //Check if an image has been added to the textarea, and if so add it to the images object.
  function checkForImage(
    foundObj: FormTypes,
    isImg: { fileName: string; base64: string },
  ) {
    if (
      foundObj.__typename === "dataportal_Digg_FormTextArea" &&
      isImg.base64.includes("data:image")
    ) {
      if (foundObj.images === undefined) {
        foundObj.images = {};
      }
      foundObj.images[isImg.fileName] = isImg.base64;
    }
  }

  return (
    <Container>
      {formDataArray[0] && (
        <div className="max-w-md">
          <span ref={scrollRef} />
          <div className="space-y-lg">
            {/* Show the correct progress-bar */}
            {page !== 0 && formSteps.length > 0 && (
              <>
                <FormNav
                  pageNames={[...formSteps, t("pages|form$generate-pdf-text")]}
                  setPage={setPage}
                  forceUpdate={page - 1}
                />
                <ProgressBar page={page} totalPages={formSteps.length + 1} />
              </>
            )}

            <>
              {page === 0 && (
                <>
                  {/* If first element in form is description, render the text here */}
                  {formIntroText.title.length > 0 && (
                    <>
                      <Heading level={1} size={"lg"}>
                        {formIntroText.title}
                      </Heading>

                      <p className="text-md">{formIntroText.text}</p>
                    </>
                  )}
                  <Button
                    onClick={() => {
                      setPage(page + 1);
                      handleScroll(scrollRef);
                    }}
                    label={t("pages|form$start-evaluation-text")}
                  />
                </>
              )}

              {formDataArray.map((data: FormTypes[], index) => {
                index++; //Start at page 1 since page 0 is the intro page
                return (
                  <div key={`page${index}`} className="space-y-lg">
                    {page === index && (
                      <>
                        <RenderForm
                          UpdateFormDataArray={UpdateFormDataArray}
                          formDataArray={data}
                          pageIndex={index}
                        />
                        <FormBottomNav
                          key={`nav${index}`}
                          setFormDataArray={setFormDataArray}
                          formDataArray={formDataArray}
                          setPage={setPage}
                          page={page}
                          scrollRef={scrollRef}
                        />
                      </>
                    )}
                  </div>
                );
              })}

              {page === formDataArray.length + 1 && (
                <FormGeneratePDF
                  formDataArray={formDataArray}
                  blocks={module ? module : null}
                />
              )}
            </>
          </div>
        </div>
      )}
    </Container>
  );
};
