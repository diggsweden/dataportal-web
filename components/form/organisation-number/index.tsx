import { cx } from "class-variance-authority";
import { usePathname } from "next/navigation";
import Organisationsnummer from "organisationsnummer";
import { FC, useState, useEffect } from "react";

import CheckIcon from "@/assets/icons/check-circle.svg";
import { Button } from "@/components/button";

import { Label } from "../label";
import { TextInput } from "../text-input";

interface OrganisationNumberProps {
  value?: string;
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: string) => void;
  // eslint-disable-next-line no-unused-vars
  onSubmit?: (value: string) => void;
}

type ValidationState = {
  isValid: boolean | null;
  errorMessage: string | null;
};

export const OrganisationNumber: FC<OrganisationNumberProps> = ({
  value = "",
  onChange,
  onSubmit,
}) => {
  const pathname = usePathname();
  const [inputValue, setInputValue] = useState(value);
  const [validation, setValidation] = useState<ValidationState>({
    isValid: null,
    errorMessage: null,
  });

  const checkValidation = (value: string) => {
    const valid = Organisationsnummer.valid(value);
    const startsWithValidPrefix = value.startsWith("2");

    if (!valid) {
      setValidation({
        isValid: false,
        errorMessage:
          "Please enter a valid Swedish organization number (XXXXXX-XXXX)",
      });
    } else if (!startsWithValidPrefix) {
      setValidation({
        isValid: false,
        errorMessage:
          "Enbart offentliga aktörer kan använda detta verktyg...!!!!",
      });
    } else {
      setValidation({
        isValid: true,
        errorMessage: null,
      });
    }
  };

  // Load saved value from localStorage on mount
  useEffect(() => {
    const savedValue = localStorage.getItem(`${pathname}OrgNumber`);
    if (savedValue) {
      setInputValue(savedValue);
      onChange?.(savedValue);
      checkValidation(savedValue);
    }
  }, [pathname, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
    setValidation({ isValid: null, errorMessage: null });

    // Save to localStorage
    if (newValue) {
      localStorage.setItem(`${pathname}OrgNumber`, newValue);
    } else {
      localStorage.removeItem(`${pathname}OrgNumber`);
    }
  };

  const handleSubmit = () => {
    checkValidation(inputValue);
    onSubmit?.(inputValue);
  };

  return (
    <div
      className={cx(
        "form-item relative flex flex-col gap-sm",
        validation.isValid === null
          ? "bg-red-50"
          : validation.isValid
          ? "!bg-green-100"
          : "bg-red-50",
      )}
    >
      <Label>Organisationsnummer</Label>
      <div className="flex gap-sm">
        <TextInput
          placeholder="XXXXXX-XXXX"
          value={inputValue}
          onChange={handleChange}
          className="mt-sm"
        />
        <Button
          label="Validate"
          onClick={handleSubmit}
          className="mt-sm justify-between"
        />
      </div>
      {validation.errorMessage && (
        <span className="text-sm text-red-600">{validation.errorMessage}</span>
      )}
      {validation.isValid && (
        <div className="absolute right-lg top-lg hidden md:block">
          <CheckIcon className="text-green-600" />
        </div>
      )}
    </div>
  );
};
