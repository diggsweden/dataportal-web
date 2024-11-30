import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import React, { FC, useCallback, useState } from "react";

import ChevronDownIcon from "@/assets/icons/chevronDown.svg";
import ChevronUpIcon from "@/assets/icons/chevronUp.svg";
import { Button } from "@/components/button";
import { Label } from "@/components/form/label";
import { RadioInput } from "@/components/form/radio-input";
import { TextInput } from "@/components/form/text-input";
import { Textarea } from "@/components/form/textarea";
import { Heading } from "@/components/typography/heading";
import { HtmlParser } from "@/components/typography/html-parser";
import { FormTypes } from "@/types/form";

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
  return (
    <Label htmlFor={`${Type}${ID}`}>
      {number === -1 ? "Old:" : `${number}. ${title}`}
    </Label>
  );
};

interface Props {
  UpdateFormDataArray: (
    _e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    _data: FormTypes,
    _pageIndex: number,
  ) => void;
  formDataArray: Array<FormTypes>;
  pageIndex: number;
}

const FormItem = (
  item: FormTypes,
  UpdateFormDataArray: (
    _e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    _data: FormTypes,
    _pageIndex: number,
    _imgData?: { fileName: string; base64: string } | null,
  ) => void,
  pageIndex: number,
  t: Translate,
) => {
  const { ID, __typename: Type } = item;

  const handleImageDrop = useCallback(
    (e: React.DragEvent<HTMLTextAreaElement>) => {
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
            e as unknown as React.ChangeEvent<HTMLTextAreaElement>,
            item,
            pageIndex,
            {
              fileName: file.name,
              base64,
            },
          );
        }
      };
    },
    [],
  );

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
            className="mb-md space-y-sm"
            aria-expanded={
              item.selected !== item.choices[item.choices.length - 1] &&
              item.selected.popup &&
              item.selected.popup.length > 0
                ? "true"
                : false
            }
          >
            <legend className="font-strong">
              {item.number === -1 ? "Old:" : `${item.number}. ${item.title}`}
            </legend>

            {item.info && PopOver({ text: item.info, title: item.title })}

            {item.choices.map((choice) => {
              return (
                <Label
                  key={choice.ID}
                  className="mb-md flex items-center gap-md"
                >
                  <RadioInput
                    name={`${Type}${ID}`}
                    checked={item.selected.ID === choice.ID}
                    value={choice.label}
                    onChange={(e) => {
                      UpdateFormDataArray(e, choice, pageIndex);
                    }}
                  />

                  {`${choice.label}${choice.popup ? "*" : ""}`}
                </Label>
              );
            })}
          </fieldset>

          {item.selected.popup && item.selected.popup.length > 0 && (
            <>
              <Label htmlFor={`${Type}${ID}`} className="[&_a]:text-sm">
                {HtmlParser({ text: item.selected.popup })}
              </Label>
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
  }
};

export const RenderForm = ({
  formDataArray,
  UpdateFormDataArray,
  pageIndex,
}: Props) => {
  const { t } = useTranslation("pages");

  return (
    <>
      {formDataArray.map((item) => {
        return (
          <div key={`item-${item.ID}`} className="space-y-sm">
            {FormItem(item, UpdateFormDataArray, pageIndex, t)}
          </div>
        );
      })}
    </>
  );
};
