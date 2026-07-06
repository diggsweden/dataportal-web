import { cva, cx, type VariantProps } from "class-variance-authority";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ComponentProps,
  FC,
  PropsWithChildren,
} from "react";

import { AppLink } from "@/components/link";
import type { AddIcon } from "@/types/global";

type IntlLinkProps = Pick<ComponentProps<typeof AppLink>, "locale">;

const buttonVariants = cva(["button"], {
  variants: {
    size: {
      xs: ["button--xs"],
      sm: ["button--small"],
      md: ["button--medium"],
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

// Used to come from `SettingsContext.iconSize` (responsive to root
// font-size). The context dance forced `<Button>` into a client tree
// because `useContext` is client-only, which in turn made server
// components unable to render `<Button icon={SomeSvg}>` (function refs
// can't cross the RSC → CC boundary). Inlining the defaults keeps
// `<Button>` fully RSC-safe; the dynamic font-scaled icons were a
// nice-to-have we'll revisit if needed.
const ICON_SIZE_PX = 16;

function iconSizePx(size: ButtonSize | null | undefined): number {
  return size === "sm" || size === "xs" ? ICON_SIZE_PX : 1.5 * ICON_SIZE_PX;
}

type ButtonSize = "xs" | "sm" | "md" | "lg";
type IconPosition = "left" | "right";

interface IconProps {
  icon?: AddIcon;
  iconPosition?: IconPosition;
  label?: string;
  size?: ButtonSize | null;
}

/**
 * Renders the optional icon + label content shared between `<Button>`
 * and `<ButtonLink>`. Pure JSX, no hooks, no context — runs in the
 * caller's environment (server or client) so `icon` (a component
 * reference) never has to cross an RSC ↔ CC prop boundary.
 */
function ButtonContent({ icon: Icon, iconPosition, label, size }: IconProps) {
  const px = iconSizePx(size);
  return (
    <>
      {iconPosition === "left" && Icon && (
        <Icon
          className="flex-shrink-0"
          height={px}
          width={px}
          viewBox="0 0 24 24"
        />
      )}
      {label && <span>{label}</span>}
      {iconPosition === "right" && Icon && (
        <Icon
          className="flex-shrink-0"
          height={px}
          width={px}
          viewBox="0 0 24 24"
        />
      )}
    </>
  );
}

type ButtonProps = VariantProps<typeof buttonVariants> & {
  icon?: AddIcon;
  iconPosition?: IconPosition;
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
      aria-label={label}
      {...rest}
    >
      <ButtonContent
        size={size ?? "lg"}
        iconPosition={iconPosition}
        icon={icon}
        label={label}
      />
      {children}
    </button>
  );
};

type ButtonLinkProps = VariantProps<typeof buttonVariants> &
  IntlLinkProps & {
    icon?: AddIcon;
    iconPosition?: IconPosition;
    label?: string;
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
  locale,
  icon,
  iconPosition,
  children,
  ...rest
}) => {
  return (
    <AppLink
      href={href}
      locale={locale}
      className={cx(buttonVariants({ variant, size }), className)}
      {...rest}
    >
      <ButtonContent
        size={size ?? "lg"}
        iconPosition={iconPosition}
        icon={icon}
        label={label}
      />
      {children}
    </AppLink>
  );
};

export { Button, ButtonLink };
