import { css } from "@digg/design-system";

/* eslint-disable no-unused-vars */
type Props = {
  formSteps: string[];
  curPage: number;
  /* Callback function that gets called if an element in the progress bar gets clicked. This implementation is not type-safe.*/
  clickCallback?: (e: any) => any;
};
/* eslint-enable no-unused-vars */

const FormProgress = ({ formSteps, curPage, clickCallback }: Props) => {
  return (
    <div className="progress-container">
      {formSteps.map((step, index) => {
        return (
          <div
            css={css`
              max-width: ${100 / formSteps.length}%;
            `}
            onClick={() => {
              if (clickCallback) {
                clickCallback(index + 1);
              }
            }}
            className={`progress-item ${curPage > index ? "active" : ""} ${
              curPage - 1 > index ? "not-current" : ""
            } ${clickCallback ? "clickable" : ""}`}
            key={index}
          >
            <p className={`${curPage === index + 1 ? "font-bold" : ""}`}>
              {step}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default FormProgress;
