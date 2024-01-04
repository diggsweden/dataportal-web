import React, { FC, InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const TextInput: FC<TextInputProps> = ({ className, ...props }) => (
  <input
    type="text"
    {...props}
    className={`hover:outline-out focus:outline-out active:outline-out h-[52px] 
    w-full border border-brown-600
    bg-white
    p-md text-textPrimary placeholder:text-textSecondary
    hover:outline-brown-800 focus:outline-brown-800 active:outline-brown-800 ${className}`}
  />
);
