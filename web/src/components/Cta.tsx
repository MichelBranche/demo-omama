import Link from "next/link";
import { CtaArrow, ShapeOverlays } from "@/components/units/Icons";

type Props = {
  href: string;
  children: string;
  className?: string;
  external?: boolean;
  dark?: boolean;
};

export function Cta({ href, children, className = "", external, dark = true }: Props) {
  const cls = `cta js-color-button-fill ${dark ? "background-black" : ""} ${className}`.trim();
  const inner = (
    <>
      <span className={`f-a-20-120 ${dark ? "color-white" : "color-black"}`}>{children}</span>
      <CtaArrow fill={dark ? "white" : "black"} />
      <ShapeOverlays />
    </>
  );

  if (external) {
    return (
      <a className={cls} href={href} target="_blank" rel="noreferrer">
        {inner}
      </a>
    );
  }

  return (
    <Link className={cls} href={href}>
      {inner}
    </Link>
  );
}
