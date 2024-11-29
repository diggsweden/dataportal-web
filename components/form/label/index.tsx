import { FC, LabelHTMLAttributes, PropsWithChildren } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export const Label: FC<PropsWithChildren<LabelProps>> = ({
  children,
  className,
  ...props
}) => (
  <label
    {...props}
    className={`cursor-pointer text-sm font-strong ${
      className ? className : ""
    }`}
  >
    {children}
  </label>
);
