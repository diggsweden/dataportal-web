import { FC, InputHTMLAttributes } from "react";

interface RadioInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const RadioInput: FC<RadioInputProps> = ({
  className,
  label,
  ...props
}) => (
  <label className="group relative flex min-w-[4rem] cursor-pointer items-center justify-center p-md lg:h-[4rem] lg:w-[8rem]">
    <input
      type="radio"
      {...props}
      className={`inset-0 peer absolute h-full w-full cursor-pointer appearance-none rounded-sm
      border border-brown-600 bg-white !outline-offset-[3px] checked:bg-green-600
      hover:outline hover:outline-primary 
      disabled:cursor-not-allowed disabled:border-brown-400 disabled:bg-brown-400
      disabled:checked:bg-brown-200 disabled:hover:outline-none
      ${className}`}
    />
    <span className="relative z-10 text-center text-textPrimary peer-checked:text-white">
      {label}
    </span>
  </label>
);
