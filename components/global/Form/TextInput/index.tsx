import React, { ChangeEvent, FC } from "react";

interface TextInputProps {
  id: string;
  name?: string;
  placeholder?: string;
  autoComplete?: "on" | "off";
  // eslint-disable-next-line no-unused-vars
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const TextInput: FC<TextInputProps> = ({
  id,
  name,
  placeholder,
  autoComplete = "on",
  onChange,
}) => (
  <input
    id={id}
    name={name}
    autoComplete={autoComplete}
    placeholder={placeholder}
    onChange={(e) => onChange && onChange(e)}
    className="hover:outline-out focus:outline-out active:outline-out
    h-[52px] w-full border border-brown-600
    bg-white
    p-md text-textPrimary placeholder:text-textSecondary
    hover:outline-brown-800 focus:outline-brown-800 active:outline-brown-800"
  />
);
