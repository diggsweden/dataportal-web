import { FC, InputHTMLAttributes } from "react";

interface RadioInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const RadioInput: FC<RadioInputProps> = ({ className, ...props }) => (
  <input
    type="radio"
    tabIndex={0}
    {...props}
    className={`h-[16px] w-[16px] cursor-pointer appearance-none rounded-full
    border border-brown-600 bg-white !outline-offset-[3px] checked:border-collapse
    checked:border-[5px] hover:outline hover:outline-primary focus-visible:!outline-[3px] 
    disabled:cursor-not-allowed disabled:border-brown-400 disabled:bg-brown-400
  disabled:checked:bg-brown-200 disabled:hover:outline-none
    ${className}`}
  />
);
