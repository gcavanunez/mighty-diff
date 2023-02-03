// button.tsx
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { LinkProps } from "next/link";
import Link from "next/link";

// ⚠️ Disclaimer: Use of Tailwind CSS is optional
const button = cva(
  "inline-flex items-center justify-center rounded-md border text-center  font-semibold uppercase tracking-widest transition focus:outline-none focus:ring disabled:opacity-25 shadow-sm",
  {
    variants: {
      width: {
        full: ["w-full"],
        auto: ["w-auto"],
      },
      intent: {
        primary: [
          "bg-gray-800",
          "text-white",
          "border-transparent",
          "hover:bg-gray-700",
          "focus:border-gray-900",
          "focus:ring-gray-300",
          "active:bg-gray-900",
        ],
        danger: [
          "text-white",
          "border-transparent",
          "bg-red-600",
          "hover:bg-red-500",
          "focus:border-red-700",
          "focus:ring-red-200",
          "active:bg-red-600",
        ],
        white: [
          "bg-white",
          "border-gray-300",
          "text-gray-700",
          "hover:text-gray-500",
          "focus:border-blue-300",
          "focus:ring-blue-200",
          "active:bg-gray-50",
          "active:text-gray-800",
        ],
        secondary: [
          "bg-white",
          "text-gray-800",
          "border-gray-400",
          "hover:bg-gray-100",

          "focus:border-gray-500",
          "focus:ring-gray-300",
          "active:bg-gray-50",
        ],
        tertiary: [
          "bg-transparent",
          "text-gray-800",
          "border-transparent",
          "hover:bg-gray-100",

          "focus:border-gray-400",
          "focus:ring-gray-300",
          "active:bg-gray-50",
        ],
      },
      size: {
        small: ["text-xs", "py-1.5", "px-2"],
        medium: ["text-sm", "py-2", "px-4"],
      },
    },
    // https://github.com/joe-bell/cva#targeting-multiple-variant-conditions
    // compoundVariants: [{ intent: "primary", size: "medium" }],
    defaultVariants: {
      intent: "primary",
      size: "medium",
      width: "full",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const AppButton: React.FC<ButtonProps> = ({
  className,
  intent,
  size,
  width,
  ...props
}) => (
  <button className={button({ intent, size, className, width })} {...props} />
);

type AppLinkProps = LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof button>;

export const AppLink: React.FC<AppLinkProps> = ({
  className,
  intent,
  size,
  width,
  ...props
}) => (
  <Link className={button({ intent, size, className, width })} {...props} />
);
