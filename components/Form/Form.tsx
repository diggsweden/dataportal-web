import React, { useEffect, useState } from 'react';
import { GenerateHTML } from './Utils/GenerateHTMLForPDF';
import { FormPage } from './FormPages';
import { MainContainerStyle } from '../../styles/general/emotion';
import { ArrowIcon, Button, Container, css, Heading } from '@digg/design-system';
import FormTypes, { EventType } from './FormTypes';
import FormProgress from './ProgressComponent/FormProgress';
import { FortroendeIntroPage } from './FortroendeModellen/FortroendeIntroPage';
import dataArray from './FortroendeModellen/FortroendeData'; //This data will be fetched from strapi in the future
import {
  FormBackButton,
  FormNavButtons,
  FormWrapper,
} from './Styles/FormStyles';

const GenerateFile = (
  e: React.MouseEvent<HTMLButtonElement>,
  iframeRef: React.RefObject<HTMLIFrameElement>,
  formDataArray: (FormTypes)[][]
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

export const Form: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [formDataArray, setFormDataArray] = useState<Array<Array<FormTypes>>>([]);
  const [formSteps, setFormSteps] = useState<string[]>([]); //The title of the different pages

  useEffect(() => {
    SetupPages(dataArray);
  }, []);

  const SetupPages =(data: FormTypes[]) =>{
    if(data == null){ return;}
    let pageArray: Array<Array<FormTypes>> = [];
    let currentPage: Array<FormTypes> = [];
    setFormSteps([]);

    //Make sure that nessecary fields exists
    data.forEach((item) => {
      if (item.Type === 'TextChoice') {
        item.Choice = 'NA';
      }
      if (item.Type === 'TextChoice' || item.Type === 'Text' || item.Type === 'TextArea') {
        item.Value = '';
      }
    });

    //Split the data into pages and page titles
    data.forEach((item) => {
      if (item.Type === 'PageBreak') {
        setFormSteps((prev) => [...prev, item.Title]);
        if (currentPage.length > 1) {
          pageArray.push(currentPage);
          currentPage = [];
        }
        currentPage.push(item);
      } else {
        currentPage.push(item);
      }
    });

    if (currentPage.length > 0) {
      pageArray.push(currentPage);
    }

    setFormDataArray(pageArray);
  }

  const UpdateFormDataArray = (
    e: EventType,
    data: FormTypes,
    pageIndex: number
  ) => {
    pageIndex = pageIndex - 1; //Page index starts at 1 since we hardcode the first page.

    //If boolean, then we're updating a yes/no question
    if (typeof e === 'string') {
      setFormDataArray((prev) => {
        let tmpData = [...prev];
        tmpData[pageIndex] = tmpData[pageIndex].map((item) => {
          if (item.ID === data.ID) {
            return { ...item, Choice: e };
          } else {
            return item;
          }
        });
        return tmpData;
      });
    } else {
      setFormDataArray((prev) => {
        let tmpData = [...prev];
        tmpData[pageIndex] = tmpData[pageIndex].map((item) => {
          if (item.ID === data.ID) {
            return { ...item, Value: e.target.value };
          } else {
            return item;
          }
        });
        return tmpData;
      });
    }
  };

  const ClearForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    //Clear the "Value" field on all objects that has the Value field.
    let tmpArr = formDataArray.map((item) => {
      item.forEach((data) => {
        if ('Value' in data) {
          data.Value = '';
        }
        if('Choice' in data){
          data.Choice = 'NA';
        }
      });
      return item;
    });

    setFormDataArray(tmpArr);
  };


  //Get JSON from file, will change to a fetch
  const [file, setFile] = useState<File | null>(null);
  useEffect(() => {
    if (file != null) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const formData = (e.target?.result as string) || '';

        setPage(0);
        SetupPages(JSON.parse(formData));
      };
      reader.readAsText(file);
    }
  }, [file]);

  return (
    <Container cssProp={MainContainerStyle}>
      {page > 0 && (
        <FormBackButton
          onClick={() => {
            setPage(page - 1);
            window.scrollTo(0, 0);
          }}
        >
          <span>
            <ArrowIcon
              color={'white'}
              width={'18px'}
            />
            <p className="text-base font-bold">Föregående avsnitt</p>
          </span>
        </FormBackButton>
      )}
      <Heading
        size={'3xl'}
        weight={'light'}
        color={'pinkPop'}
        css={css`
          margin-top: 0;
          ${page === 0 ? 'margin-top: 3.625rem; margin-bottom: 1rem' : ''}
        `}
      >
        Förtroende&shy;modellen
      </Heading>

      {page !== 0 && (
        <FormProgress
          formSteps={[...formSteps, 'Generera PDF']}
          curPage={page}
          clickCallback={setPage}
        />
      )}
      <FormWrapper>
        <>
          {page === 0 && (
            <>
              <input type="file" id="inputJson" accept=".json" title='Förtroendemodellen'
              onChange={(file)=>{file.target.files && setFile(file.target.files[0])}} />
              <FortroendeIntroPage setPage={setPage} page={page} />
            </>
          )}

          {formDataArray.map((data: (FormTypes)[], index) => {
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
                          window.scrollTo(0, 0);
                        }}                        
                      >
                        <span>
                          <p>Nästa avsnitt</p>
                          <ArrowIcon width={'18px'} />
                        </span>
                      </Button>
                      <Button
                        onClick={(e) => {
                          ClearForm(e);
                        }}
                      >
                        Rensa alla svar
                      </Button>
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
                className='text-md font-medium'
                css={css`
                  margin: 3rem 0;
                  `}>
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