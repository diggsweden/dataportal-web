import { cx } from "class-variance-authority";
import { usePathname } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
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
  const { t } = useTranslation("pages");
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
        errorMessage: t("form$organisation-number-validation"),
      });
    } else if (!startsWithValidPrefix) {
      setValidation({
        isValid: false,
        errorMessage: t("form$organisation-number-validation-public"),
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
      <Label>{t("form$organisation-number")}</Label>
      <div className="flex gap-sm">
        <TextInput
          placeholder="XXXXXX-XXXX"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
          className="mt-sm"
        />
        <Button
          label={t("form$validate")}
          onClick={handleSubmit}
          className="mt-sm justify-between"
        />
      </div>
      {validation.errorMessage && (
        <span className="text-sm">{validation.errorMessage}</span>
      )}
      {validation.isValid && (
        <div className="absolute right-lg top-lg hidden md:block">
          <CheckIcon className="text-green-600" />
        </div>
      )}
    </div>
  );
};
