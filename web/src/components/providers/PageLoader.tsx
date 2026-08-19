"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function PageLoader() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      document.body.classList.add("is-loading");

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mark = el.querySelector(".mark");
      const bar = el.querySelector(".bar span");

      const done = () => {
        document.body.classList.remove("is-loading");
        document.body.classList.add("is-ready");
        window.dispatchEvent(new Event("omama:ready"));
      };

      if (reduce) {
        gsap.set(el, { autoAlpha: 0, display: "none" });
        done();
        return;
      }

      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          gsap.set(el, { display: "none" });
          done();
        },
      });

      tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.95, ease: "power3.inOut" })
        .to(mark, { y: -18, autoAlpha: 0, duration: 0.45, ease: "power3.in" }, "+=0.12")
        .to(el, { autoAlpha: 0, duration: 0.4, ease: "power2.out" }, "-=0.12");

      void document.fonts.ready.then(() => tl.play());
    },
    { scope: root },
  );

  return (
    <div ref={root} className="preloader" aria-hidden>
      <p className="mark">OMAMA</p>
      <div className="bar">
        <span />
      </div>
    </div>
  );
}
