import { FormTypes } from "@/types/form";
import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import React, { FC, useCallback, useState } from "react";
import { Heading } from "@/components/global/Typography/Heading";
import { HtmlParser } from "@/components/global/Typography/HtmlParser";
import ChevronDownIcon from "@/assets/icons/chevronDown.svg";
import ChevronUpIcon from "@/assets/icons/chevronUp.svg";
import { TextInput } from "@/components/global/Form/TextInput";
import { Textarea } from "@/components/global/Form/Textarea";
import { Label } from "@/components/global/Form/Label";
import { Button } from "@/components/global/Button";
import { RadioInput } from "@/components/global/Form/RadioInput";

const PopOver: FC<{ text: string }> = (text) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="my-sm" aria-haspopup={visible}>
      <Button
        icon={visible ? ChevronUpIcon : ChevronDownIcon}
        iconPosition="right"
        label={visible ? "Stäng mer information" : "Visa mer information"}
        onClick={() => setVisible(!visible)}
        variant={"plain"}
        size={"xs"}
        className="mb-xs w-[12.188rem] justify-between"
      />
      <p
        className={`text-sm text-textSecondary ${
          visible ? "visible" : "hidden"
        }`}
      >
        {HtmlParser(text)}
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

/* eslint-disable no-unused-vars */
interface Props {
  UpdateFormDataArray: (
    e: React.ChangeEvent<any>,
    data: FormTypes,
    pageIndex: number,
  ) => void;
  formDataArray: Array<FormTypes>;
  pageIndex: number;
}

/* eslint-enable no-unused-vars */

const FormItem = (
  item: FormTypes,
  UpdateFormDataArray: (
    /* eslint-disable no-unused-vars */
    e: React.ChangeEvent<any>,
    data: FormTypes,
    pageIndex: number,
    imgData?: { fileName: string; base64: string } | null,
    /* eslint-enable no-unused-vars */
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
          UpdateFormDataArray(e, item, pageIndex, {
            fileName: file.name,
            base64,
          });
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
          {item.info !== null && PopOver({ text: item.info })}
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
          {item.info !== null && PopOver({ text: item.info })}
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

            {item.info && PopOver({ text: item.info })}

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
