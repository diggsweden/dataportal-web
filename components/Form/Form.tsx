import React, { useEffect, useState } from 'react';
import { GenerateHTML } from './Utils/GenerateHTMLForPDF';
import { FormPage } from './FormPages';
import { ArrowIcon, Button, Container, css, Heading } from '@digg/design-system';
import FormTypes from './FormTypes';
import FormProgress from './ProgressComponent/FormProgress';
import { DiggConfirmModal, DiggProgressbar, FormBackButton, FormNavButtons, FormWrapper } from './Styles/FormStyles';
import { Form_dataportal_Digg_Form as IForm } from '../../graphql/__generated__/Form';
import Link from 'next/link';
import { MainContainerStyle } from '../../styles/general/emotion';
import { FormDropdownNavigation } from '../Navigation/FormDropdownNavigation';

const GenerateFile = (
  e: React.MouseEvent<HTMLButtonElement>,
  iframeRef: React.RefObject<HTMLIFrameElement>,
  formDataArray: FormTypes[][]
) => {
  e.preventDefault();
  //Generate the PDF html data and set the iframe
  let docToPrint = GenerateHTML(formDataArray);
  iframeRef?.current?.setAttribute('srcDoc', docToPrint);

  //For some reason we can't access .print unless we add a slight delay
  setTimeout(() => {
    iframeRef.current?.contentWindow?.print();
  }, 20);
};

const GenerateJsonFile = (formDataArray: FormTypes[][]) => {
  const json = JSON.stringify(formDataArray);
  const blob = new Blob([json], { type: 'application/json' });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  const date = new Date().toLocaleDateString();
  link.download = `Fortroendemodellen${date}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const ImportFromJsonFile = (e: React.ChangeEvent<HTMLInputElement>, formData: FormTypes[][], setFormDataArray: React.Dispatch<React.SetStateAction<FormTypes[][]>>) => {
  if(e.target.files === null){return;}

  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result;
    if (!text) {return};

    const importedData: FormTypes[][]= JSON.parse(text as string);
    let matchingForm = true;
    formData.every((page, pageIndex) => {
      page.every((field, fieldIndex) => {
        let importedField = importedData[pageIndex][fieldIndex];

        if((field.__typename !== importedField?.__typename) || ('title' in field && 'title' in importedField && field.title !== importedField.title)){
          alert('The imported file does not match the current form');
          matchingForm = false;
          return false;
        }
      });
      if(!matchingForm){
        return false;
      }
    });
  
    if(matchingForm){
      setFormDataArray(importedData);
    }
  };
  reader.readAsText(file);
};

export const Form: React.FC<IForm> = ({ elements }) => {
  const [page, setPage] = useState<number>(0);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const scrollRef = React.useRef<HTMLSpanElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const [formDataArray, setFormDataArray] = useState<Array<Array<FormTypes>>>([]);
  const [formSteps, setFormSteps] = useState<string[]>([]); //The title of the different pages
  const [showFirstPage, setShowFirstPage] = useState<boolean>(true);
  const [formIntroText, setFormIntroText] = useState<{ title: string; text: string }>({
    title: '',
    text: '',
  });
  let questionNumber = 1; //Used for visual numberings (can't use ID since we don't want headings/pagebreaks to be numbered)

  useEffect(() => {
    if (elements === undefined) {
      return;
    }
    (elements as FormTypes[]).forEach((element, index) => {
      element.ID = index; //Make sure each element has a unique ID
    });

    SetupPages(elements as FormTypes[]);
    GetLocalstorageData();
  }, []);

  const GetLocalstorageData = () => {
    const localData = localStorage.getItem('formData');
    if (localData) {
      let data: FormTypes[][] = JSON.parse(localData);
      let tmpArr = data.map((item) => {
        item.forEach((data) => {
          if ('choices' in data) {
            data.selected = data.selected;
          }
        });
        return item;
      });

      //todo: Should we do a deeper check to see if the questions are the same?
      //Use localstorage data if they contain the same amount of questions
      if (tmpArr.length > 0) {
        let tmpArr2 = tmpArr.reduce((page, item) => page.concat(item), []);

        let elementsLength = elements.length;
        if ((elements as FormTypes[])[0].__typename === 'dataportal_Digg_FormDescription') {
          elementsLength--;
        }

        if (tmpArr2.length === elementsLength) {
          setFormDataArray(tmpArr);
        } else {
          localStorage.removeItem('formData');
        }
      }
    }
  };

  const SetupPages = (data: FormTypes[]) => {
    if (data === null) {
      return;
    }

    let currentPage: Array<FormTypes> = [];
    let pageArray: Array<Array<FormTypes>> = [];
    setFormSteps([]);

    //Make sure that nessecary fields exists and have default values
    data.forEach((item) => {
      if (item.__typename === 'dataportal_Digg_FormRadio') {
        item.selected = item.choices[item.choices.length - 1];
        item.value = '';
        item.number = questionNumber;
        questionNumber++;

        item.choices.forEach((choice, i) => {
          if (choice.popup === null) {
            choice.popup = '';
          }
          choice.ID = parseInt(`${item.ID}${i}`); //create a unique id by using the parent id and the index of the choice
        });
      }
      if (
        item.__typename === 'dataportal_Digg_FormText' ||
        item.__typename === 'dataportal_Digg_FormTextArea'
      ){
        item.value = '';
        item.number = questionNumber;
        questionNumber++;
      }
      if (item.__typename === 'dataportal_Digg_FormDescription') {
        item.TopHeading = false;
      }
    });

    if (data[0].__typename === 'dataportal_Digg_FormDescription') {
      setShowFirstPage(true);
      setFormIntroText({
        title: data[0].title,
        text: data[0].text,
      });
    } else {
      setShowFirstPage(false);
    }

    //Split the data into pages
    var checkTopHeading = true;
    data.forEach((item, i) => {
      //If first element is a description, we don't want to add it to our data array
      if (i === 0 && item.__typename === 'dataportal_Digg_FormDescription') {
        return;
      }

      if (item.__typename === 'dataportal_Digg_FormPageBreak') {
        setFormSteps((prev) => [...prev, item.title]);
        if (currentPage.length > 1) {
          pageArray.push(currentPage);
          currentPage = [];
          checkTopHeading = true;
        }
        currentPage.push(item);
      } else {
        if (checkTopHeading && item.__typename === 'dataportal_Digg_FormDescription') {
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

  //Set correct starting page depending if any pagebreak exists or not.
  useEffect(() => {
    if (!showFirstPage && formSteps.length > 0) {
      setPage(1);
    } else {
      setPage(0);
    }
  }, [showFirstPage]);

  const UpdateFormDataArray = (e: React.ChangeEvent<any>, data: FormTypes, pageIndex: number) => {
    pageIndex = pageIndex - 1; //Page index starts at 1 since we hardcode the first page.

    //If radio then update selected, otherwise just update the value
    if (data.__typename === 'dataportal_Digg_FormChoice') {
      setFormDataArray((prev) => {
        let arrCopy = [...prev];
        arrCopy[pageIndex] = arrCopy[pageIndex].map((item) => {
          //Update selected value
          if ('choices' in item) {
            item.choices.forEach((choice) => {
              if (choice.ID === data.ID) {
                item.selected = data;
              }
            });
          }
          return item;
        });
        return arrCopy;
      });
    } else {
      setFormDataArray((prev) => {
        let arrCopy = [...prev];
        arrCopy[pageIndex] = arrCopy[pageIndex].map((item) => {
          if ('value' in item && item.ID === data.ID) {
            item.value = e.target.value;
          }
          return item;
        });
        return arrCopy;
      });
    }
    localStorage.setItem('formData', JSON.stringify(formDataArray));
  };

  const ClearForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    //Clear the "Value" field on all objects that has the Value field.
    let tmpArr = formDataArray.map((item) => {
      item.forEach((data) => {
        if ('value' in data) {
          data.value = '';
        }
        if ('choices' in data) {
          data.selected = data.choices[data.choices.length - 1];
          data.value = '';
        }
      });
      return item;
    });

    setFormDataArray(tmpArr);
    localStorage.removeItem('formData');
  };

  const handleScroll = () => {
    if (scrollRef.current?.offsetTop === undefined || window.pageYOffset === undefined) {
      return;
    }
    if (
      window.pageYOffset > scrollRef.current.offsetTop - 300 ||
      window.pageYOffset < scrollRef.current.offsetTop - 300
    ) {
      if (scrollRef.current != null) {
        scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <Container cssProp={MainContainerStyle}>
      {page > (showFirstPage ? 0 : 1) && (
        <FormBackButton
          onClick={() => {
            setPage(page - 1);
            if (page - 1 === 0) {
              window.scrollTo(0, 0);
            } else {
              handleScroll();
            }
          }}
        >
          <span className="back-button">
            <ArrowIcon
              color={'white'}
              width={'18px'}
            />
            <span className="text-base font-medium back-text">Föregående avsnitt</span>
          </span>
        </FormBackButton>
      )}

      <FormWrapper>
        {page === (showFirstPage ? 0 : 1) && (
          <Link href={'/ai/fortroendemodellen'}>
            <FormBackButton>
              <span className="back-button">
                <ArrowIcon
                  color={'white'}
                  width={'18px'}
                />
                <span className="text-base font-medium back-text">Tillbaka</span>
              </span>
            </FormBackButton>
          </Link>
        )}
        {page !== 0 && formSteps.length > 1 && (
          <>
            {formSteps.length < 5 ? (
              <FormProgress
                formSteps={[...formSteps, 'Generera PDF']}
                curPage={page}
                clickCallback={setPage}
              />
            ) : (
              <>
                <FormDropdownNavigation pageNames={[...formSteps, 'Generera PDF']} setPage={setPage} />
                <DiggProgressbar
                  page={page}
                  totPages={formSteps.length}
                  data-page={page}
                  data-totalpages={formSteps.length + 1}
                />
              </>
            )}

            <span ref={scrollRef}></span>
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
                    size={'3xl'}
                    weight={'light'}
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
                  handleScroll();
                }}
                css={css`
                  margin: 3rem 0;
                  width: 13rem;
                `}
                className="text-base"
              >
                Starta utvärdering
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

                    <FormNavButtons>
                      <Button
                        primary
                        onClick={() => {
                          setPage(page + 1);
                          handleScroll();
                        }}
                      >
                        <span>
                          Nästa avsnitt
                          <ArrowIcon className="nav-icon" width={"18px"} />
                        </span>
                      </Button>
                      <span>
                        <Button
                          css={css`
                            font-weight: 500;
                          `}
                          onClick={(e) => {
                            e.preventDefault();
                            GenerateJsonFile(formDataArray);
                          }}
                        >
                          Spara
                        </Button>
                        <input
                          type="file"
                          accept="application/json"
                          title="Ladda upp JSON"
                          ref={fileInputRef}
                          onChange={(e) => {
                            ImportFromJsonFile(
                              e,
                              formDataArray,
                              setFormDataArray
                            );
                          }}
                          css={css`
                            display: none;
                          `}
                        />
                        <Button
                          css={css`
                            font-weight: 500;
                          `}
                          onClick={(e) => {
                            e.preventDefault();
                            fileInputRef.current?.click();
                          }}
                        >
                          Ladda upp JSON-fil
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            modalRef.current?.classList.remove("hide");
                            modalRef.current?.scrollIntoView({
                              behavior: 'auto',
                              block: 'center',
                              inline: 'center'
                          });
                          }}
                          css={css`
                            font-weight: 500;
                          `}
                        >
                          Rensa alla svar
                        </Button>
                        <DiggConfirmModal ref={modalRef} className="hide">
                          <div className="modal-content">
                            <p>Är du säker?</p>
                            <div className="modal-buttons">
                              <button
                                onClick={(e) => {
                                  ClearForm(e);
                                  modalRef.current?.classList.add("hide");
                                }}
                              >
                                Ja
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  modalRef.current?.classList.add("hide");
                                }}
                              >
                                Nej
                              </button>
                            </div>
                          </div>
                        </DiggConfirmModal>
                      </span>
                    </FormNavButtons>
                  </>
                )}
              </React.Fragment>
            );
          })}

          {page === formDataArray.length + 1 && (
            <>
              <Button
                primary
                onClick={(e) => GenerateFile(e, iframeRef, formDataArray)}
                type="submit"
                className="text-base font-medium"
                css={css`
                  margin: 3rem 0;
                `}
              >
                Generate PDF
              </Button>
            </>
          )}
        </>
      </FormWrapper>

      {/* Hidden iframe used only for printing */}
      <iframe
        ref={iframeRef}
        title="frame"
        id="printFrame"
        srcDoc="<div>Empty</div>"
        css={css`
          display: none;
        `}
      ></iframe>
    </Container>
  );
};

export default Form;