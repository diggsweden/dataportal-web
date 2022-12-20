import React from 'react';
import { Button, css } from '@digg/design-system';
import { useRouter } from 'next/router';
import { DiggConfirmModal } from '../Styles/FormStyles';
import { GeneratePDF } from '../Utils/formUtils';
import FormTypes from '../FormTypes';
import useTranslation from 'next-translate/useTranslation';

type Props = {
    formDataArray: FormTypes[][];
  };

const FormGeneratePDF: React.FC<Props> = ({formDataArray}) => {
    const router = useRouter();
    const iframeRef = React.useRef<HTMLIFrameElement>(null);
    const finishedModalRef = React.useRef<HTMLDivElement>(null);
    const {t} = useTranslation();

  return (
    <>
      <Button
        primary
        onClick={(e) => {
          GeneratePDF(e, iframeRef, formDataArray);
          setTimeout(() => {
            finishedModalRef.current?.classList.remove("hide");
          }, 500);
        }}
        type="submit"
        className="text-base font-medium"
        css={css`
          margin: 3rem 0;
        `}
      >
        {t('pages|form$generate-pdf-text')}
      </Button>
      <DiggConfirmModal ref={finishedModalRef} className="hide">
        <div className="modal-content">
          <p>{t('pages|form$form-continue-text')}</p>
          <div className="modal-buttons">
            <button
              onClick={(e) => {
                e.preventDefault();
                finishedModalRef.current?.classList.add("hide");
                router.push("/ai/fortroendemodellen/success");
              }}
            >
              {t('common|yes')}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                finishedModalRef.current?.classList.add("hide");
              }}
            >
              {t('common|no')}
            </button>
          </div>
        </div>
      </DiggConfirmModal>

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
    </>
  );
}


export default FormGeneratePDF