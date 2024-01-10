import { FC, TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea: FC<TextareaProps> = ({ className, ...props }) => (
  <textarea
    {...props}
    className={`hover:outline-out focus:outline-out active:outline-out h-[168px] w-full 
    border border-brown-600 bg-white p-md text-textPrimary placeholder:text-textSecondary
    hover:outline-brown-800 focus:outline-brown-800 active:outline-brown-800 disabled:cursor-not-allowed 
    disabled:bg-brown-400 disabled:text-textSecondary disabled:hover:outline-none ${className}`}
  />
);
