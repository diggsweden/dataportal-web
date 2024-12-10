import { cx, cva, VariantProps } from "class-variance-authority";
import Link from "next/link";
import {
  FC,
  PropsWithChildren,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  useContext,
} from "react";

import { SettingsContext } from "@/providers/settings-provider";
import { AddIcon } from "@/types/global";

const buttonVariants = cva(["button"], {
  variants: {
    size: {
      xs: ["button--xs"],
      sm: ["button--small"],
      lg: ["button--small md:button--large"],
    },
    variant: {
      primary: ["button--primary"],
      secondary: ["button--secondary"],
      light: ["button--light"],
      plain: ["button--plain"],
      pink: ["button--pink"],
      filter: ["button--filter"],
    },
  },
  defaultVariants: {
    size: "lg",
    variant: "primary",
  },
});

type IconLabelProps = {
  icon?: AddIcon;
  size?: "xs" | "sm" | "lg";
  label?: string;
  iconPosition?: "left" | "right";
  iconSizeBase?: number;
};

const IconLabel: FC<IconLabelProps> = ({
  icon,
  label,
  size,
  iconPosition,
  iconSizeBase,
}) => {
  const Icon = icon;
  const { iconSize: contextIconSize } = useContext(SettingsContext);

  return (
    <>
      {iconPosition === "left" && Icon && (
        <Icon
          height={
            iconSizeBase
              ? iconSizeBase
              : size === "lg"
              ? 1.5 * contextIconSize
              : contextIconSize
          }
          width={
            iconSizeBase
              ? iconSizeBase
              : size === "lg"
              ? 1.5 * contextIconSize
              : contextIconSize
          }
          viewBox="0 0 24 24"
        />
      )}
      {label && <span>{label}</span>}
      {iconPosition === "right" && Icon && (
        <Icon
          height={
            iconSizeBase
              ? iconSizeBase
              : size === "lg"
              ? 1.5 * contextIconSize
              : contextIconSize
          }
          width={
            iconSizeBase
              ? iconSizeBase
              : size === "lg"
              ? 1.5 * contextIconSize
              : contextIconSize
          }
          viewBox="0 0 24 24"
        />
      )}
    </>
  );
};

type ButtonProps = VariantProps<typeof buttonVariants> & {
  icon?: AddIcon;
  iconPosition?: "left" | "right";
  iconSize?: number;
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
  iconSize,
  label,
  children,
  ...rest
}) => {
  return (
    <button
      className={cx(buttonVariants({ variant, size }), className)}
      aria-label={label}
      {...rest}
    >
      <IconLabel
        size={size ? size : "lg"}
        iconSizeBase={iconSize}
        iconPosition={iconPosition}
        icon={icon}
        label={label}
      />
      {children}
    </button>
  );
};

type ButtonLinkProps = VariantProps<typeof buttonVariants> & {
  icon?: AddIcon;
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
