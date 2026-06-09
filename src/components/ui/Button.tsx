import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({ children, className = "", variant = "secondary", size = "md", ...props }: ButtonProps) {
  return (
    <button className={`button ${variant} ds-button ds-button-${size} ${className}`.trim()} type="button" {...props}>
      {children}
    </button>
  );
}
