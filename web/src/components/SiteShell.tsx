"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { PageLoader } from "@/components/providers/PageLoader";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.toggle("home", pathname === "/");
  }, [pathname]);

  return (
    <>
      <SmoothScroll />
      <PageLoader />
      <Nav />
      <main id="app">
        {children}
        <Footer />
      </main>
    </>
  );
}
