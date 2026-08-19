import Link from "next/link";
import { BOOKING_URL, navLinks } from "@/lib/content";

export function Footer() {
  return (
    <footer className="site-footer">
      <a className="wordmark" href={BOOKING_URL} target="_blank" rel="noreferrer">
        OMAMA
      </a>
      <div className="bottom">
        <div>
          <span className="f-aleb-20-110">Via Torino 14 · Aosta</span>
          <p className="f-a-16-120 s-10">Demo indipendente. Prenotazioni su omamahotel.com</p>
          <p className="f-a-16-120 s-10">
            <a className="omama-credit" href="https://michelbranche.it" target="_blank" rel="noreferrer">
              Website &amp; Design By <span className="omama-credit-name">Michel branche</span>
            </a>
          </p>
        </div>
        <ul className="no-list footer-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="f-a-16-120">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
