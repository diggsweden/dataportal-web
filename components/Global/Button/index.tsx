import React, {
  FC,
  PropsWithChildren,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
} from "react";
import { cx, cva, VariantProps } from "class-variance-authority";
import Image from "next/image";
import Link from "next/link";

const buttonVariants = cva([""], {
  variants: {
    size: {
      plain: ["h-[24px] text-sm px-xs"],
      sm: ["h-[32px] text-sm px-md"],
      lg: ["h-[44px] text-md px-md"],
    },
    variant: {
      primary: ["bg-brown-600"],
      secondary: ["bg-white"],
      negative: ["bg-red-600"],
    },
  },
  defaultVariants: {
    size: "lg",
    variant: "primary",
  },
});

type IconLabelProps = VariantProps<typeof buttonVariants> & {
  icon?: any;
  label?: string;
  iconPosition?: "left" | "right";
};

const IconLabel: FC<IconLabelProps> = ({ icon, label, size, iconPosition }) => {
  return (
    <>
      {iconPosition === "left" && (
        <Image
          src={icon}
          alt="button icon"
          height={size === "lg" ? 32 : 16}
          width={size === "lg" ? 32 : 16}
        />
      )}
      {label && label}
      {iconPosition === "right" && (
        <Image
          src={icon}
          alt="button icon"
          height={size === "lg" ? 32 : 16}
          width={size === "lg" ? 32 : 16}
        />
      )}
    </>
  );
};

type ButtonProps = VariantProps<typeof buttonVariants> & {
  icon?: any;
  iconPosition?: "left" | "right";
  label?: string;
};

const Button: FC<
  PropsWithChildren<ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>>
> = ({ variant, size, className, icon, iconPosition, label, ...rest }) => {
  return (
    <button
      className={cx(buttonVariants({ variant, size }), className)}
      {...rest}
    >
      <IconLabel iconPosition={iconPosition} icon={icon} label={label} />
    </button>
  );
};

type ButtonLinkProps = VariantProps<typeof buttonVariants> & {
  icon?: any;
  iconPosition?: "left" | "right";
  label?: string;
  className?: string;
  href: string;
};

const ButtonLink: FC<
  PropsWithChildren<ButtonLinkProps & AnchorHTMLAttributes<HTMLAnchorElement>>
> = ({
  variant,
  size,
  className,
  label,
  href,
  icon,
  iconPosition,
  ...rest
}) => {
  return (
    <Link
      href={href}
      className={cx(buttonVariants({ variant, size }), className)}
      {...rest}
    >
      <IconLabel iconPosition={iconPosition} icon={icon} label={label} />
    </Link>
  );
};

export { Button, ButtonLink };
