import React, { FC } from "react";

interface TextInputProps {
  id: string;
  name?: string;
  placeholder?: string;
  autoComplete?: "on" | "off";
}

export const TextInput: FC<TextInputProps> = ({
  id,
  name,
  placeholder,
  autoComplete = "on",
}) => (
  <input
    id={id}
    name={name}
    autoComplete={autoComplete}
    placeholder={placeholder}
    className="hover:outline-out focus:outline-out active:outline-out
    w-full border border-brown-600 bg-white
    p-md text-textPrimary placeholder:text-textSecondary
    hover:outline-brown-800 focus:outline-brown-800 active:outline-brown-800"
  />
);
