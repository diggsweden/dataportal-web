import { FC, LabelHTMLAttributes, PropsWithChildren } from "react";

export const Label: FC<
  PropsWithChildren<LabelHTMLAttributes<HTMLLabelElement>>
> = ({ children, className, ...props }) => (
  <label
    {...props}
    className={`cursor-pointer break-words text-lg font-thin text-brown-600 lg:text-xl ${
      className ? className : ""
    }`}
  >
    {children}
  </label>
);
