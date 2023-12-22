import React, { FC } from "react";
import { TextInput } from "@/components/global/Form/TextInput";

interface SearchInputProps {
  id: string;
  placeholder: string;
}

export const SearchInput: FC<SearchInputProps> = ({ id, placeholder }) => (
  <TextInput id={id} name="q" autoComplete="off" placeholder={placeholder} />
);
