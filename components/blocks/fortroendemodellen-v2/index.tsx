import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { Button } from "@/components/button";
// import { FormGeneratePDF } from "@/components/form/form-generate-pdf";
import { RenderForm } from "@/components/form/render-form";
import { Container } from "@/components/layout/container";
import { FormBottomNav } from "@/components/navigation/form-bottom-nav";
import { FormNav } from "@/components/navigation/form-nav";
import { Heading } from "@/components/typography/heading";
import { FormDataFragment } from "@/graphql/__generated__/operations";
import { FormTypes } from "@/types/form";
import { fetchFortroendemodellenForm } from "@/utilities/form-utils";
import { GetLocalstorageData, handleScroll } from "@/utilities/form-utils";

interface FormData {
  id: string;
  preamble: string;
  elements: FormDataFragment["elements"];
}

export const FortroendemodellenFrom = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const pathname = usePathname();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const scrollRef = useRef<HTMLSpanElement>(null);
  const [formDataArray, setFormDataArray] = useState<Array<Array<FormTypes>>>(
    [],
  );
  const [formSteps, setFormSteps] = useState<string[]>([]);
  const [showFirstPage, setShowFirstPage] = useState<boolean>(true);
  const [formIntroText, setFormIntroText] = useState<{
    title: string;
    text: string;
  }>({ title: "", text: "" });
  let questionNumber = 1;

  // Set breadcrumbs

  const getFortroendemodellenForm = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchFortroendemodellenForm(router.locale || "sv");

      // Add IDs to elements
      if (data.elements) {
        (data.elements as FormTypes[]).forEach((element, index) => {
          element.ID = index;
        });
      }

      setFormData(data);
    } catch (err) {
      console.error("Error fetching form data:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Fetch form data when router is ready
  useEffect(() => {
    if (router.isReady) {
      getFortroendemodellenForm();
    }
  }, [router.isReady, router.locale]);

  // Process form elements when formData changes
  useEffect(() => {
    if (!formData?.elements || formData.elements.length === 0) {
      return;
    }

    const elements = formData.elements;
    SetupPages(elements as FormTypes[]);
    GetLocalstorageData(setFormDataArray, elements, pathname);
  }, [formData, pathname]);

  const SetupPages = (data: FormTypes[]) => {
    if (data == null) {
      return;
    }
    let currentPage: Array<FormTypes> = [];
    const pageArray: Array<Array<FormTypes>> = [];
    setFormSteps([]);

    initializeFields(data);

    let checkTopHeading = true;
    data.forEach((item, i) => {
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
    data.forEach((item) => {
      setupItem(item);
      if (item.__typename === "dataportal_Digg_FormRadio") {
        // Don't set any default selection
        item.selected = null;
        item.choices.forEach((choice, i) => {
          if (choice.popup === null) {
            choice.popup = "";
            choice.exploratory = false;
          }
          choice.ID = parseInt(`${item.ID}${i}`);
        });
      }
      if (item.__typename === "dataportal_Digg_FormDescription") {
        item.TopHeading = false;
      }
    });

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

  const setupItem = (item: FormTypes) => {
    if (
      item.__typename === "dataportal_Digg_FormText" ||
      item.__typename === "dataportal_Digg_FormTextArea" ||
      item.__typename === "dataportal_Digg_FormRadio" ||
      item.__typename === "dataportal_Digg_FormDropdown" ||
      item.__typename === "dataportal_Digg_FormCheckbox"
    ) {
      if (item.__typename === "dataportal_Digg_FormDropdown") {
        item.selected = null;
      }
      item.value = "";
      item.number = questionNumber;
      questionNumber++;
    }
  };

  useEffect(() => {
    const pageLastVisit = localStorage.getItem(`${pathname}Page`);
    if (!showFirstPage) {
      setPage(pageLastVisit ? parseInt(pageLastVisit) : 1);
    } else {
      setPage(pageLastVisit ? parseInt(pageLastVisit) : 0);
    }
  }, [showFirstPage, pathname]);

  useEffect(() => {
    if (page === 0) return;
    localStorage.setItem(`${pathname}Page`, page.toString());
  }, [page, pathname]);

  const UpdateFormDataArray = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    fieldToUpdate: FormTypes,
    pageIndex: number,
    imgData: { fileName: string; base64: string } | null = null,
  ) => {
    pageIndex = pageIndex - 1;

    if (fieldToUpdate.__typename === "dataportal_Digg_FormChoice") {
      setFormDataArray((prev) => {
        const itemIndex = prev[pageIndex].findIndex(
          (item) =>
            "choices" in item &&
            item.choices.some((choice) => choice.ID === fieldToUpdate.ID),
        );
        const foundObj = prev[pageIndex][itemIndex];
        if (foundObj && "choices" in foundObj) {
          if (foundObj.__typename === "dataportal_Digg_FormCheckbox") {
            // Initialize selected as array if it doesn't exist or is not an array
            if (!foundObj.selected || !Array.isArray(foundObj.selected)) {
              foundObj.selected = [];
            }
            // Find the choice in the choices array
            const choice = foundObj.choices.find(
              (c) => c.label === fieldToUpdate.label,
            );
            if (choice) {
              // Add or remove the choice from the selected array based on checkbox state
              const choiceIndex = foundObj.selected.findIndex(
                (c) => c.label === choice.label,
              );
              if ((e.target as HTMLInputElement).checked) {
                if (choiceIndex === -1) {
                  foundObj.selected.push(choice);
                }
              } else {
                if (choiceIndex !== -1) {
                  foundObj.selected.splice(choiceIndex, 1);
                }
              }
            }
          } else {
            foundObj.selected = fieldToUpdate;
          }
        }
        return [...prev];
      });
    } else if (fieldToUpdate.__typename === "dataportal_Digg_FormDropdown") {
      setFormDataArray((prev) => {
        const itemIndex = prev[pageIndex].findIndex(
          (item) => item.ID === fieldToUpdate.ID,
        );
        const foundObj = prev[pageIndex][itemIndex];
        if (foundObj && "items" in foundObj) {
          const selectedItem = foundObj.items.find(
            (item) => item.value === e.target.value,
          );
          if (selectedItem) {
            // @ts-expect-error
            foundObj.selected = {
              ID: foundObj.ID,
              __typename: "dataportal_Digg_FormChoice",
              label: selectedItem.value,
              exploratory: false,
              popup: selectedItem.popup
            };
            foundObj.value = selectedItem.value;
          }
        }
        return [...prev];
      });
    } else {
      setFormDataArray((prev) => {
        const itemIndex = prev[pageIndex].findIndex(
          (item) => item.ID === fieldToUpdate.ID,
        );
        const foundObj = prev[pageIndex][itemIndex];
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

  if (loading) {
    return (
      <Container>
        <div>Loading...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div>Error: {error}</div>
      </Container>
    );
  }

  return (
    <Container>
      {formDataArray[0] && (
        <div
          id="FormPage"
          className="grid grid-cols-1 lg:max-w-xl lg:grid-cols-[200px_620px_1fr] lg:gap-x-xl"
        >
          {page !== 0 && formSteps.length > 0 && (
            <FormNav
              pageNames={[...formSteps, t("pages|form$summary")]}
              setPage={setPage}
              scrollRef={scrollRef}
              forceUpdate={page - 1}
            />
          )}

          <>
            {page === 0 && (
              <>
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
              index++;
              if (page === index) {
                return (
                  <div
                    key={`page${index}`}
                    className="col-span-1 col-start-1 row-start-2 max-w-md lg:col-start-2 lg:row-start-1"
                  >
                    <span ref={scrollRef} />

                    <span className="text-lg text-textSecondary">
                      {t("pages|form$questions")}
                    </span>
                    <RenderForm
                      UpdateFormDataArray={UpdateFormDataArray}
                      formDataArray={data}
                      pageIndex={index}
                    />
                    <FormBottomNav
                      fortroendemodellen
                      key={`nav${index}`}
                      setFormDataArray={setFormDataArray}
                      formDataArray={formDataArray}
                      setPage={setPage}
                      page={page}
                      scrollRef={scrollRef}
                    />
                  </div>
                );
              }
            })}

            {/* {page === formDataArray.length + 1 && (
              <FormGeneratePDF
                formDataArray={formDataArray}
                blocks={null}
              />
            )} */}
          </>
        </div>
      )}
    </Container>
  );
};
