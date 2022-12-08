import { styled, colorPalette, theme } from "@digg/design-system";

export const TempContainer = styled.div`
  background: #212121;
  color: white;
  
  max-width: calc(100% - 2rem);
  margin: auto;
`;

export const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  color: white;

  transition: all 0.2s ease-in-out;
  
  @media screen and (min-width: 1024px) {       
    max-width: 46.063rem; //737 px
  }

  label {
    margin-bottom: 1rem;
    &:first-of-type{
      margin-top: 0;
    }

    a{
      text-decoration: underline;

      &:hover{
        text-decoration: none;
      }
    }
  }

  legend{
    margin-bottom: 1rem;
    &:first-of-type{
      margin-top: 0;
    }
  }
`;

export const FormBackButton = styled.button`
  color: white;
  width: fit-content;
  border: none;
  background-color: transparent;
  cursor: pointer;
  padding-left: 0;
  margin-top: 3rem;
  margin-bottom: 1rem;
  
  .back-button{
    display: flex;    
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .back-text{
    margin: 0;
    margin-left: 0.5rem;
  }

  svg{
    transform: rotate(180deg);
  }
`;

export const FormGeneratePDFButton = styled.button`
  align-self: flex-start;
  width: fit-content;
  border-radius: 2px;
  background-color: white;

  padding: 12px;
  border: 1px solid ${colorPalette.pinkPop};
  font-size: 1.2rem;
  margin-bottom: 10px;
  cursor: pointer;
  &:hover {
    background-color: ${colorPalette.pink900};
  }
`;

//Wrapper for buttons
export const FormNavButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;

  span{
    display: flex;    
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;

    .nav-icon{
      padding: 0;
      margin: 0;
      margin-left: 0.5rem;
    }
  }

  button{
    width: fit-content;
    max-width: 13rem;

    &:first-of-type{
      margin-right: 0.5rem;
    }
    &:last-of-type{
      margin-left: 0.5rem;
    }
  }

  &.start-buttons{
    flex-direction: column;

    button{
      margin-left: 0;
      margin-top: 1rem;
    }
    a:active{
      translate: none;
    }
    button > a > span {
      color: black;
      text-decoration: none;
      border: none;

      &:hover{
        color: black;

        svg{
          fill: black;
        }
      }
    }
  }
`;

//Form text input
export const FormTextArea = styled.textarea`
  background-color: transparent;  
  color: white;
  margin-bottom: 2rem;

  border-radius: 2px;
  border: 1px solid ${colorPalette.pinkPop};
  min-height: 7rem;
  height: 5rem;
  padding: 0.5rem;
  line-height: 1.3;
  font-weight: 400;

  &::placeholder {
    color: ${colorPalette.gray500};
  }

  &:focus {
    border: 2px solid ${colorPalette.pinkPop};
    margin: -1px;
    margin-bottom: calc(2rem + 1px);
  }
`;

export const Text = styled.input`
  background-color: transparent;
  color: white;
  padding: 0.5rem;
  border-radius: 2px;
  border: 1px solid ${colorPalette.pinkPop};
  margin-bottom: 2rem;

  &::placeholder {
    color: ${colorPalette.gray500};
  }

  &:focus {
    border: 2px solid ${colorPalette.pinkPop};
    margin: -1px;
    margin-bottom: calc(2rem - 1px);
  }
`;

//Form text sections
export const FormHeader = styled.h1`
  font-size: 3rem;
  color: ${colorPalette.pinkPop};
  margin-bottom: 2rem;
  font-weight: 100;
`;

export const FormSectionContent = styled.div`
  margin-bottom: 0.5rem;
  letter-spacing: -1%;
  font-weight: 400;
`;

//Radiobutton styles
export const DiggRadio = styled.input`
  margin-right: 0.75rem;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  display: inline-block;
  position: relative;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  transition: all 0.12s ease-in-out;  
  border: ${colorPalette.pinkPop} solid 1px;

  /* &:checked {
    background-color: #d87a00;    
  } */

  &:checked::after {
    content: "";
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 14px;
    width: 14px;
    border-radius: 50%;
    background-color: ${colorPalette.pinkPop}; 
  }

  &:focus {
    box-shadow: 0 0 0 3px ${colorPalette.pinkPop};
  }

  .no-focus-outline &:focus {
    box-shadow: none;
  }
`;

export const DiggRadioWrapper = styled.div`  
  display: flex;
  flex-direction: column;

  label{
    padding: 0;
    margin: 0;
    margin-right: 1rem;

    input,
    span{
      margin-bottom: 0.5rem;
    }
  }
`;

export const DiggRadioLabel = styled.label` 
  margin-top: 10px;
  font-weight: 400;
  display: flex;
  align-items: center;  
  cursor: pointer;
  align-items: stretch;
`;

export const DiggTextWithLink = styled.p`
  a{
    text-decoration: underline;

    &:hover{
      text-decoration: none;
    }    
  }

  ul{
      padding-left: 1rem;
      margin-top: 0;
    }
`;

export const DiggPopover = styled.span`
  display: inline;
  div {
    position: relative;
    overflow: hidden;
    height: 24px;

    &:before {
      position: absolute;
      content: 'Visa mer information';
      text-decoration: underline;
      font-size: 14px;
      font-weight: 400;
      top: 0;
      left: 0;
    }

    &:hover::before {
      text-decoration: none;
    }

    &:hover{
      cursor: pointer;
    }
  }

  .open {
    height: auto;
    width: 100%;

    &:before {
      content: 'Stäng mer information';
    }
  }
`;

export const DiggProgressbar = styled('span')<{ page: number; totPages: number }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;

  width: 100%;
  height: 15px;
  background-color: ${colorPalette.gray800};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: calc((${(p) => p.page}) / (${(p) => p.totPages + 1}) * 100%);
    height: 15px;
    background-color: ${colorPalette.pinkPop};
  }

  &::after {
    content: '${(p) => p.page} / ${(p) => (p.totPages + 1)}';
    font-size: 12px;
    z-index: 100;
  }
`;

export const DiggConfirmModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  display: block;
  
  contain: paint;


  &.hide{
    display: none;
  }
  
  .modal-content{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: ${colorPalette.gray900};
    border: 1px solid ${colorPalette.pinkPop};
    padding: 2rem;
    width: 100%;
    max-width: 300px;
    text-align: center;
  }

  .modal-buttons{
    display: flex;
    justify-content: center;

    button{
      color: white;
      background-color: transparent;
      border: 1px solid ${colorPalette.pinkPop};
      outline: none;
      cursor: pointer;
      padding: 1rem;

      &:hover{
        border-color: ${colorPalette.white};
      }
    }
  }
`;