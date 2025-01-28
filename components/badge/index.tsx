import { FC } from "react";

interface BadgeProps {
  text: string;
  className?: string;
  id?: string;
}

export const Badge: FC<BadgeProps> = ({ text, className, id, ...props }) => {
  return (
    <span
      id={id}
      className={`bg-green-200 px-sm py-xs text-sm uppercase ${
        className || ""
      }`}
      {...props}
    >
      {text}
    </span>
  );
};
