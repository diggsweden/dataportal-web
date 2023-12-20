import {
  FC,
  PropsWithChildren,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
} from "react";
import { cx, cva, VariantProps } from "class-variance-authority";
import Link from "next/link";

const buttonVariants = cva(
  [
    "flex flex-row items-center [&_svg]:inline-flex disabled:bg-brown-400 disabled:text-brown-600 [&_path]:disabled:fill-brown-600 disabled:border-none",
  ],
  {
    variants: {
      size: {
        sm: ["h-[32px] text-sm px-md gap-sm "],
        lg: ["h-[44px] text-md px-md gap-sm "],
      },
      variant: {
        primary: [
          "bg-brown-600 text-brown-100 hover:bg-brown-800 [&_path]:fill-brown-100",
        ],
        secondary: [
          "border-brown-600 border-2 bg-transparent text-brown-600 hover:bg-whiteOpaque5 [&_path]:fill-brown-600",
        ],
        plain: ["text-brown-600 hover:bg-brown-200 [&_path]:fill-brown-600"],
      },
    },
    defaultVariants: {
      size: "lg",
      variant: "primary",
    },
  },
);

type IconLabelProps = {
  icon?: any;
  size?: "plain" | "sm" | "lg";
  label?: string;
  iconPosition?: "left" | "right";
};

const IconLabel: FC<IconLabelProps> = ({ icon, label, size, iconPosition }) => {
  const Icon = icon;

  return (
    <>
      {iconPosition === "left" && (
        <Icon
          height={size === "lg" ? 24 : 16}
          width={size === "lg" ? 24 : 16}
          viewBox="0 0 24 24"
        />
      )}
      {label && <span>{label}</span>}
      {iconPosition === "right" && (
        <Icon
          height={size === "lg" ? 24 : 16}
          width={size === "lg" ? 24 : 16}
          viewBox="0 0 24 24"
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
      <IconLabel
        size={size ? size : "lg"}
        iconPosition={iconPosition}
        icon={icon}
        label={label}
      />
    </button>
  );
};

type ButtonLinkProps = VariantProps<typeof buttonVariants> & {
  icon?: any;
  iconPosition?: "left" | "right";
  label?: string;
  className?: string;
  href: string;
  locale?: string;
};

const ButtonLink: FC<
  PropsWithChildren<ButtonLinkProps & AnchorHTMLAttributes<HTMLAnchorElement>>
> = ({
  variant,
  size,
  className,
  label,
  href,
  locale,
  icon,
  iconPosition,
  ...rest
}) => {
  return (
    <Link
      href={href}
      className={cx(buttonVariants({ variant, size }), className)}
      locale={locale}
      {...rest}
    >
      <>
        <IconLabel
          size={size ? size : "lg"}
          iconPosition={iconPosition}
          icon={icon}
          label={label}
        />
      </>
    </Link>
  );
};

export { Button, ButtonLink };
