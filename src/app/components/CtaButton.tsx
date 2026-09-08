import Link from "next/link";
import type { ComponentProps } from "react";

type CtaButtonProps = ComponentProps<typeof Link>;

export default function CtaButton({
  className = "",
  children,
  ...props
}: CtaButtonProps) {
  return (
    <Link
      className={`inline-block rounded-full bg-white px-6 py-2 font-bold text-black no-underline transition-colors hover:bg-[var(--color-highlight)] ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
