import { FC, InputHTMLAttributes, PropsWithChildren } from "react";

interface MultiSelectProps extends InputHTMLAttributes<HTMLInputElement> {
  choice: {
    exploratory: boolean;
    label: string;
    popup: string | null;
    __typename: "dataportal_Digg_FormChoice";
  };
}

export const MultiSelect: FC<PropsWithChildren<MultiSelectProps>> = ({
  id,
  choice,
  ...props
}) => {
  return (
    <div className="flex items-center gap-sm">
      <input
        className="checkbox min-h-lg min-w-lg cursor-pointer"
        type="checkbox"
        id={id}
        {...props}
      />
      <label className="text-sm text-textSecondary" htmlFor={id}>
        {choice.label}
      </label>
    </div>
  );
};
