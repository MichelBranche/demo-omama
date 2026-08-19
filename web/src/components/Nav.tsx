"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BOOKING_URL, navLinks } from "@/lib/content";
import { ArrowCorner, CtaArrow, ShapeOverlays } from "@/components/units/Icons";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header>
      <div className={`header-wrap${open ? " open" : ""}`}>
        <div className="logo-wrap">
          <Link href="/" className="logo d-block" onClick={() => setOpen(false)}>
            <img className="omama-mark omama-logo-img" src="/images/omama-logo.png" alt="OMAMA" />
          </Link>
        </div>
        <ul className={`main-menu no-list${open ? " is-open" : ""}`}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={pathname.startsWith(link.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <span className="index f-ab-14-120" />
                  <ArrowCorner />
                </div>
                <span className="f-ab-16-120">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <a
          className="open-modal-btn button background-purple-dark js-color-button-fill"
          href={BOOKING_URL}
          target="_blank"
          rel="noreferrer"
        >
          <span className="f-ab-16-120-b color-black">Prenota</span>
          <CtaArrow fill="black" />
          <ShapeOverlays />
        </a>
        <div className="social desktop-social background-black">
          <a href="https://www.omamahotel.com/" target="_blank" rel="noreferrer" aria-label="Sito ufficiale">
            www
          </a>
        </div>
        <button
          className={`hamburger button${open ? " open" : ""}`}
          aria-label="menu"
          type="button"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
