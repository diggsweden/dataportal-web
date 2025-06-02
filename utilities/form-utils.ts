import {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  RefObject,
  SetStateAction,
} from "react";

import { ParseDocToHtml } from "@/components/typography/parse-doc-to-html";
import { browserclient } from "@/graphql";
import { FormDataFragment } from "@/graphql/__generated__/operations";
import { FOETROENDEMODELLEN_FORM_CLIENT_QUERY } from "@/graphql/formQuery";
import { FormTypes } from "@/types/form";

/* Import json */
export const ImportFromJsonFile = (
  e: ChangeEvent<HTMLInputElement>,
  formData: FormTypes[][],
  setFormDataArray: Dispatch<SetStateAction<FormTypes[][]>>,
) => {
  if (e.target.files === null) {
    return;
  }

  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result;
    if (!text) {
      return;
    }

    const importedData: FormTypes[][] = JSON.parse(text as string);

    //combine imported data with current form data, use current form data if the imported data is missing a question
    let newArr: FormTypes[][] = [];
    formData.forEach((page, pageIndex) => {
      let newPage: FormTypes[] = [];

      page.forEach((field) => {
        //check if field title exists in imported data
        let importedField = importedData[pageIndex]?.find((item) => {
          if ("value" in field && "value" in item) {
            return field.title === item.title;
          }
        });

        //If we find the field in the imported data, use imported, otherwise use current form data (blank question).
        if (importedField) {
          newPage.push(importedField);
        } else {
          newPage.push(field);
        }
      });

      //check if imported data has any questions that are not in current form data (eg. if a question has been removed from the form since the data was exported)
      importedData[pageIndex]?.forEach((field) => {
        if (
          field.__typename === "dataportal_Digg_FormDescription" ||
          field.__typename === "dataportal_Digg_FormPageBreak"
        ) {
          return;
        }

        //If we can't find the field in the current form data, add it to the new page
        let fieldToFind = !page.find((item) => {
          if ("value" in field && "value" in item) {
            return field.title === item.title;
          }
        });
        if (fieldToFind) {
          newPage.push(field);
        }
      });

      newArr.push(newPage);
    });

    //Add number and ID to each field
    let questionNumber = 1;
    let id = 0;
    newArr.forEach((page) => {
      page.forEach((field) => {
        if ("value" in field) {
          // @ts-expect-error - TODO: fix this waldo
          field.number = questionNumber;
          questionNumber++;
        }
        if ("choices" in field) {
          field.choices.forEach((choice, i) => {
            choice.ID = parseInt(`${field.ID}${i}`);
          });
        }
        field.ID = id;
        id++;
      });
    });

    setFormDataArray(newArr);
  };
  reader.readAsText(file);
};

export const GeneratePDF = (
  e: MouseEvent<HTMLButtonElement>,
  iframeRef: RefObject<HTMLIFrameElement>,
  formDataArray: FormTypes[][],
) => {
  e.preventDefault();
  //Generate the PDF html data and set the iframe
  let docToPrint = ParseDocToHtml(formDataArray);
  iframeRef?.current?.setAttribute("srcDoc", docToPrint);

  //For some reason we can't access .print unless we add a slight delay
  setTimeout(() => {
    iframeRef.current?.contentWindow?.print();
  }, 20);
};

//Generate and download a json file with the form data
export const GenerateJsonFile = (formDataArray: FormTypes[][]) => {
  const json = JSON.stringify(formDataArray);
  const blob = new Blob([json], { type: "application/json" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  const date = new Date().toLocaleDateString();
  link.download = `Fortroendemodellen${date}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const GetLocalstorageData = (
  setFormDataArray: Dispatch<SetStateAction<FormTypes[][]>>,
  elements: FormDataFragment["elements"],
  path: string,
) => {
  const localData = localStorage.getItem(`${path}Data`);
  if (localData) {
    let data: FormTypes[][] = JSON.parse(localData);
    let tmpArr = data.map((item) => {
      item.forEach((data) => {
        if ("choices" in data) {
          data.selected = data.selected || null;
        }
      });
      return item;
    });

    //todo: Should we do a deeper check to see if the questions are the same?
    //Use localstorage data if they contain the same amount of questions
    if (tmpArr.length > 0) {
      let tmpArr2 = tmpArr.reduce((page, item) => page.concat(item), []);

      let elementsLength = elements.length;
      if (
        (elements as FormTypes[])[0].__typename ===
        "dataportal_Digg_FormDescription"
      ) {
        elementsLength--;
      }

      if (tmpArr2.length === elementsLength) {
        setFormDataArray(tmpArr);
      } else {
        localStorage.removeItem("formData");
      }
    }
  }
};

export const handleScroll = (scrollRef: RefObject<HTMLSpanElement>) => {
  if (
    scrollRef.current?.offsetTop === undefined ||
    window.pageYOffset === undefined
  ) {
    return;
  }
  if (
    window.pageYOffset > scrollRef.current.offsetTop - 300 ||
    window.pageYOffset < scrollRef.current.offsetTop - 300
  ) {
    if (scrollRef.current != null) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
};

export const fetchFortroendemodellenForm = async (locale: string) => {
  const { data, error } = await browserclient.query({
    query: FOETROENDEMODELLEN_FORM_CLIENT_QUERY,
    variables: { locale },
    fetchPolicy: "no-cache",
  });

  if (error) {
    throw error;
  }

  const formData = data?.dataportal_Digg_FoertroendemodellenForm;

  if (!formData) {
    throw new Error("No form data returned");
  }

  return formData;
};
