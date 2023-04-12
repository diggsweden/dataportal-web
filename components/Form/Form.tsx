import React, { useEffect, useState } from "react";
import { FormPage, FormBottomNav, FormGeneratePDF } from "./FormPages";
import {
  ArrowIcon,
  Button,
  Container,
  css,
  Heading,
} from "@digg/design-system";
import FormTypes from "./FormTypes";
import FormProgress from "./ProgressComponent/FormProgress";
import {
  DiggProgressbar,
  FormBackButton,
  FormWrapper,
} from "./Styles/FormStyles";
import {
  Form_dataportal_Digg_Form as IForm,
  Form_dataportal_Digg_Form_elements,
} from "../../graphql/__generated__/Form";
import Link from "next/link";
import { MainContainerStyle } from "../../styles/general/emotion";
import { FormDropdownNavigation } from "../Navigation/FormDropdownNavigation";
import { GetLocalstorageData, handleScroll } from "./Utils/formUtils";
import useTranslation from "next-translate/useTranslation";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { useRouter } from "next/router";
import { Module_dataportal_Digg_Module_blocks } from "../../graphql/__generated__/Module";

type Props = IForm & {
  elements: Form_dataportal_Digg_Form_elements[];
  module?: Module_dataportal_Digg_Module_blocks[] | null;
};

export const Form: React.FC<Props> = ({ elements, module }) => {
  const { trackPageView } = useMatomo();
  const { t } = useTranslation();
  const { pathname, asPath } = useRouter() || {};
  const [page, setPage] = useState<number>(-1);
  const scrollRef = React.useRef<HTMLSpanElement>(null);
  const [formDataArray, setFormDataArray] = useState<Array<Array<FormTypes>>>(
    []
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
    GetLocalstorageData(setFormDataArray, elements, asPath);
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
    const pageLastVisit = localStorage.getItem(`${asPath}Page`);
    if (!showFirstPage) {
      setPage(pageLastVisit ? parseInt(pageLastVisit) : 1);
    } else {
      setPage(pageLastVisit ? parseInt(pageLastVisit) : 0);
    }
  }, [showFirstPage]);

  useEffect(() => {
    if (page === -1) return;
    localStorage.setItem(`${asPath}Page`, page.toString());
  }, [page]);

  //Update the fields when data is changed in the form. Handles all types of fields.
  const UpdateFormDataArray = (
    e: React.ChangeEvent<any>,
    fieldToUpdate: FormTypes,
    pageIndex: number,
    imgData: { fileName: string; base64: string } | null = null
  ) => {
    pageIndex = pageIndex - 1; //Page index starts at 1 since we hardcode the first page.

    if (fieldToUpdate.__typename === "dataportal_Digg_FormChoice") {
      setFormDataArray((prev) => {
        //Find the index of the correct object by finding the choice with the same ID as the data (only for radio buttons)
        let itemIndex = prev[pageIndex].findIndex(
          (item) =>
            "choices" in item &&
            item.choices.some((choice) => choice.ID === fieldToUpdate.ID)
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
          (item) => item.ID === fieldToUpdate.ID
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
      localStorage.setItem(`${asPath}Data`, JSON.stringify(formDataArray));
    }, 100);
  };

  //Check if an image has been added to the textarea, and if so add it to the images object.
  function checkForImage(
    foundObj: FormTypes,
    isImg: { fileName: string; base64: string }
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
    <>
      {formDataArray[0] && (
        <Container cssProp={MainContainerStyle}>
          {page > (showFirstPage ? 0 : 1) && (
            <FormBackButton
              onClick={() => {
                setPage(page - 1);
                if (page - 1 === 0) {
                  window.scrollTo(0, 0);
                } else {
                  handleScroll(scrollRef);
                }
              }}
            >
              <span className="back-button">
                <ArrowIcon color={"white"} width={"18px"} />
                <span className="text-base font-medium back-text">
                  {t("pages|form$previous-section-text")}
                </span>
              </span>
            </FormBackButton>
          )}
          <span ref={scrollRef}></span>
          <FormWrapper>
            {page === (showFirstPage ? 0 : 1) && (
              <Link
                href={"/offentligai/fortroendemodellen"}
                css={css`
                  width: fit-content;
                `}
              >
                <FormBackButton>
                  <span className="back-button">
                    <ArrowIcon color={"white"} width={"18px"} />
                    <span className="text-base font-medium back-text">
                      {t("pages|form$go-back-text")}
                    </span>
                  </span>
                </FormBackButton>
              </Link>
            )}

            {/* Show the correct progress-bar */}
            {page !== 0 && formSteps.length > 0 && (
              <>
                {formSteps.length < 5 ? (
                  <FormProgress
                    formSteps={[
                      ...formSteps,
                      t("pages|form$generate-pdf-text"),
                    ]}
                    curPage={page}
                    clickCallback={setPage}
                  />
                ) : (
                  <>
                    <FormDropdownNavigation
                      pageNames={[
                        ...formSteps,
                        t("pages|form$generate-pdf-text"),
                      ]}
                      setPage={setPage}
                      forceUpdate={page - 1}
                    />
                    <DiggProgressbar
                      page={page}
                      totPages={formSteps.length}
                      data-page={page}
                      data-totalpages={formSteps.length + 1}
                    />
                  </>
                )}
              </>
            )}

            <>
              {page === 0 && (
                <>
                  {/* If first element in form is description, render the text here */}
                  {formIntroText.title.length > 0 && (
                    <>
                      <Heading
                        level={1}
                        color="pinkPop"
                        size={"3xl"}
                        weight={"light"}
                        css={css`
                          margin-top: 1rem;
                        `}
                      >
                        {formIntroText.title}
                      </Heading>
                      <div
                        className="text-md"
                        dangerouslySetInnerHTML={{ __html: formIntroText.text }}
                      ></div>
                    </>
                  )}

                  <Button
                    primary
                    onClick={() => {
                      setPage(page + 1);
                      handleScroll(scrollRef);
                    }}
                    css={css`
                      margin: 3rem 0;
                      width: 13rem;
                    `}
                    className="text-base"
                  >
                    {t("pages|form$start-evaluation-text")}
                  </Button>
                </>
              )}

              {formDataArray.map((data: FormTypes[], index) => {
                index++; //Start at page 1 since page 0 is the intro page
                return (
                  <React.Fragment key={`page${index}`}>
                    {page === index && (
                      <>
                        <FormPage
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
                  </React.Fragment>
                );
              })}

              {page === formDataArray.length + 1 && (
                <FormGeneratePDF
                  formDataArray={formDataArray}
                  blocks={module ? module : null}
                />
              )}
            </>
          </FormWrapper>
        </Container>
      )}
    </>
  );
};

export default Form;
