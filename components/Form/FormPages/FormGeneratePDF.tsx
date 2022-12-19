import React from 'react';
import { Button, css } from '@digg/design-system';
import { useRouter } from 'next/router';
import { DiggConfirmModal } from '../Styles/FormStyles';
import { GeneratePDF } from '../Utils/formUtils';
import FormTypes from '../FormTypes';

type Props = {
    formDataArray: FormTypes[][];
  };

const FormGeneratePDF: React.FC<Props> = ({formDataArray}) => {
    const router = useRouter();
    const iframeRef = React.useRef<HTMLIFrameElement>(null);
    const finishedModalRef = React.useRef<HTMLDivElement>(null);

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
        Generate PDF
      </Button>
      <DiggConfirmModal ref={finishedModalRef} className="hide">
        <div className="modal-content">
          <p>Vill du gå vidare?</p>
          <div className="modal-buttons">
            <button
              onClick={(e) => {
                e.preventDefault();
                finishedModalRef.current?.classList.add("hide");
                router.push("/ai/fortroendemodellen/success");
              }}
            >
              Ja
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                finishedModalRef.current?.classList.add("hide");
              }}
            >
              Nej
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