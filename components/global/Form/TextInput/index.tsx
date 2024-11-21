import { FC, InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const TextInput: FC<TextInputProps> = ({ className, ...props }) => (
  <input
    type="text"
    {...props}
    className={`hover:outline-out focus-visible:outline-out active:outline-out h-[3.25rem] w-full 
    rounded-sm border border-brown-600 bg-white p-md text-textPrimary placeholder:text-textSecondary
    hover:outline-brown-800 focus-visible:outline-brown-800 active:outline-brown-800 disabled:cursor-not-allowed 
    disabled:bg-brown-400 disabled:text-textSecondary disabled:hover:outline-none ${
      className ? className : ""
    }`}
  />
);
