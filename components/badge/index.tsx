import { FC } from "react";

interface BadgeProps {
  text: string;
  className?: string;
}

export const Badge: FC<BadgeProps> = ({ text, className }) => {
  return (
    <span className={`bg-green-200 px-sm py-xs text-sm uppercase ${className}`}>
      {text}
    </span>
  );
};
