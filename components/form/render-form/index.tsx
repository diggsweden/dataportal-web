import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import { ChangeEvent, DragEvent, FC, useCallback, useState } from "react";

import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import ChevronUpIcon from "@/assets/icons/chevron-up.svg";
import { Button } from "@/components/button";
import { Label } from "@/components/form/label";
import { RadioInput } from "@/components/form/radio-input";
import { TextInput } from "@/components/form/text-input";
import { Textarea } from "@/components/form/textarea";
import { Heading } from "@/components/typography/heading";
import { HtmlParser } from "@/components/typography/html-parser";
import { FormTypes } from "@/types/form";

import { MultiSelect } from "../multi-select";
import { Select } from "../select";

const PopOver: FC<{ text: string; title: string }> = ({ text, title }) => {
  const [visible, setVisible] = useState(false);
  const popoverId = `popover-${title.replace(/\s+/g, "-")}`;

  return (
    <div className="my-sm">
      <Button
        id={`${popoverId}-button`}
        icon={visible ? ChevronUpIcon : ChevronDownIcon}
        iconPosition="right"
        label={visible ? "Stäng mer information" : "Visa mer information"}
        onClick={() => setVisible(!visible)}
        aria-expanded={visible}
        aria-controls={popoverId}
        aria-label={
          visible
            ? `Dölj mer information om ${title}`
            : `Visa mer information om ${title}`
        }
        variant={"plain"}
        size={"xs"}
        className="mb-xs w-[12.188rem] justify-between"
      />
      <p
        id={popoverId}
        aria-labelledby={`${popoverId}-button`}
        className={`text-sm text-textSecondary ${
          visible ? "visible" : "hidden"
        }`}
      >
        {HtmlParser({ text })}
      </p>
    </div>
  );
};

const addLabel = (number: number, Type: string, ID: number, title: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation("pages");
  return (
    <div className="flex flex-col gap-md">
      <span className="text-sm text-textSecondary">
        {t("form$question")} {number}
      </span>
      <Label htmlFor={`${Type}${ID}`}>{title}</Label>
    </div>
  );
};

interface Props {
  UpdateFormDataArray: (
    _e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    _data: FormTypes,
    _pageIndex: number,
  ) => void;
  formDataArray: Array<FormTypes>;
  pageIndex: number;
}

const FormItem = (
  item: FormTypes,
  UpdateFormDataArray: (
    _e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    _data: FormTypes,
    _pageIndex: number,
    _imgData?: { fileName: string; base64: string } | null,
  ) => void,
  pageIndex: number,
  t: Translate,
) => {
  const { ID, __typename: Type } = item;

  const handleImageDrop = useCallback((e: DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const curTarget = e.currentTarget;
    const file = e.dataTransfer.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64 = reader.result;
      if (typeof base64 === "string" && base64.includes("image")) {
        const curVal = curTarget.value;
        const newVal =
          curVal.substring(0, curTarget.selectionStart) +
          `[${file.name}]` +
          curVal.substring(curTarget.selectionEnd);
        curTarget.value = newVal;
        UpdateFormDataArray(
          e as unknown as ChangeEvent<HTMLTextAreaElement>,
          item,
          pageIndex,
          {
            fileName: file.name,
            base64,
          },
        );
      }
    };
  }, []);

  switch (Type) {
    case "dataportal_Digg_FormText":
      return (
        <>
          {addLabel(item.number, Type, ID, item.title)}
          {item.info && PopOver({ text: item.info, title: item.title })}
          <TextInput
            id={`${Type}${ID}`}
            placeholder={t("form$placeholder-text")}
            name={`${Type}${ID}`}
            value={item.value}
            onChange={(e) => {
              UpdateFormDataArray(e, item, pageIndex);
            }}
          />
        </>
      );
    case "dataportal_Digg_FormTextArea":
      return (
        <>
          {addLabel(item.number, Type, ID, item.title)}
          {item.info && PopOver({ text: item.info, title: item.title })}
          <Textarea
            name={`${Type}${ID}`}
            id={`${Type}${ID}`}
            placeholder={t("form$placeholder-text")}
            value={item.value}
            onChange={(e) => {
              UpdateFormDataArray(e, item, pageIndex);
            }}
            onDrop={(e) => {
              handleImageDrop(e);
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
          />
        </>
      );
    case "dataportal_Digg_FormRadio":
      return (
        <>
          <fieldset
            className="mb-md space-y-lg"
            aria-expanded={
              item.selected &&
              item.selected !== item.choices[item.choices.length - 1] &&
              item.selected.popup &&
              item.selected.popup.length > 0
                ? "true"
                : false
            }
          >
            {addLabel(item.number, Type, ID, item.title)}
            {item.info && PopOver({ text: item.info, title: item.title })}
            <div className="flex items-center gap-md">
              {item.choices.map((choice) => {
                return (
                  <div key={choice.ID} className="flex items-center gap-md">
                    <RadioInput
                      label={choice.label}
                      name={`${Type}${ID}`}
                      checked={item.selected?.ID === choice.ID}
                      value={choice.label}
                      onChange={(e) => {
                        UpdateFormDataArray(e, choice, pageIndex);
                      }}
                    />
                  </div>
                );
              })}
              {item.selected?.popup && item.selected.popup.length > 0 && (
                <div className="ml-lg w-fit border p-xs">
                  <span className="text-sm text-red-600">
                    {HtmlParser({ text: item.selected?.popup })}
                  </span>
                </div>
              )}
            </div>
          </fieldset>

          {item.selected?.exploratory &&
            item.selected?.popup &&
            item.selected.popup.length > 0 && (
              <>
                <span className="text-sm text-textSecondary">
                  {HtmlParser({ text: item.selected?.popup })}
                </span>
                <Textarea
                  id={`${Type}${ID}`}
                  name={`${Type}${ID}`}
                  placeholder={t("form$placeholder-text")}
                  value={item.value}
                  onChange={(e) => {
                    UpdateFormDataArray(e, item, pageIndex);
                  }}
                />
              </>
            )}
        </>
      );
    case "dataportal_Digg_FormDescription":
      return (
        <>
          <Heading
            level={item.TopHeading === true ? 1 : 2}
            size={item.TopHeading === true ? "md" : "sm"}
          >
            {item.title}
          </Heading>

          {item.text.markdown?.length && item.text.markdown?.length > 9 && (
            <div className="text">
              {HtmlParser({ text: item.text.markdown })}
            </div>
          )}
        </>
      );
    case "dataportal_Digg_FormDropdown":
      return (
        <>
          {addLabel(item.number, Type, ID, item.title)}
          <div>
            <Select
              id={`${Type}${ID}`}
              options={[]}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                // @ts-expect-error
                UpdateFormDataArray(e, item, pageIndex);
              }}
              // @ts-expect-error
              value={item.selected?.value || ""}
            >
              <option value="" disabled>
                {t("form$select-placeholder")}
              </option>
              {item.items.map((option: { value: string }) => {
                return (
                  <option key={option.value} value={option.value}>
                    {option.value}
                  </option>
                );
              })}
            </Select>
            {typeof item.selected === "object" &&
              item.selected?.popup &&
              item.selected.popup.length > 0 && (
                <div className="w-fit border p-xs">
                  <span className="text-sm text-red-600">
                    {HtmlParser({ text: item.selected?.popup })}
                  </span>
                </div>
              )}
          </div>
        </>
      );
    case "dataportal_Digg_FormCheckbox":
      return (
        <>
          {addLabel(item.number, Type, ID, item.title)}
          <div className="grid grid-cols-2 gap-md">
            {item.choices.map((choice, idx: number) => {
              return (
                <MultiSelect
                  onChange={(e) => {
                    UpdateFormDataArray(e, choice, pageIndex);
                  }}
                  checked={
                    Array.isArray(item.selected)
                      ? item.selected.some((c) => c.label === choice.label)
                      : false
                  }
                  choice={choice}
                  key={idx}
                  id={`${Type}${ID}-${choice.label}`}
                />
              );
            })}
          </div>
        </>
      );
  }
};

export const RenderForm = ({
  formDataArray,
  UpdateFormDataArray,
  pageIndex,
}: Props) => {
  const { t } = useTranslation("pages");
  return (
    <div className="mt-lg space-y-lg">
      {formDataArray.map((item) => {
        return (
          item.__typename !== "dataportal_Digg_FormPageBreak" && (
            <div
              key={`item-${item.ID}`}
              className="form-item space-y-md rounded-lg"
            >
              {FormItem(item, UpdateFormDataArray, pageIndex, t)}
            </div>
          )
        );
      })}
    </div>
  );
};
