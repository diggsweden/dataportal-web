import {
  FC,
  PropsWithChildren,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
} from "react";
import { cx, cva, VariantProps } from "class-variance-authority";
import Link from "next/link";

const buttonVariants = cva(["button"], {
  variants: {
    size: {
      xs: ["button--xs"],
      sm: ["button--small"],
      lg: ["button--small lg:button--large"],
    },
    variant: {
      primary: ["button--primary"],
      secondary: ["button--secondary"],
      plain: ["button--plain"],
      filter: ["button--filter"],
    },
  },
  defaultVariants: {
    size: "lg",
    variant: "primary",
  },
});

type IconLabelProps = {
  icon?: any;
  size?: "xs" | "sm" | "lg";
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
> = ({
  variant,
  size,
  className,
  icon,
  iconPosition,
  label,
  children,
  ...rest
}) => {
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
      {children}
    </button>
  );
};

type ButtonLinkProps = VariantProps<typeof buttonVariants> & {
  icon?: any;
  iconPosition?: "left" | "right";
  label?: string;
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
      <IconLabel
        size={size ? size : "lg"}
        iconPosition={iconPosition}
        icon={icon}
        label={label}
      />
    </Link>
  );
};

export { Button, ButtonLink };
